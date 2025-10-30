import axios from 'axios'
import { getEnv } from '../utils/env'

// Vite provides import.meta.env in browser; in Jest we fallback to process.env
const env = getEnv()
const PROVIDER = (env.VITE_STOCK_API_PROVIDER || 'finnhub').toLowerCase()
const HAS_KEY = !!env.VITE_STOCK_API_KEY

const coingecko = axios.create({ baseURL: 'https://api.coingecko.com' })
const finnhub = axios.create({ baseURL: 'https://finnhub.io/api/v1' })

// naive cache using localStorage
const cacheGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
const cacheSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

// backoff controller
let backoff = 10000
const maxBackoff = 120000
const resetBackoff = () => { backoff = 10000 }
const increaseBackoff = () => { backoff = Math.min(maxBackoff, Math.ceil(backoff * 1.6)) }

function handleRateLimit(err){
  if(err?.response?.status === 429){ increaseBackoff() }
  throw err
}

// Mocked data imports (dynamic)
async function loadMock(name){
  const mod = await import(`../mocks/${name}.json`)
  return mod.default
}

export async function getTopCryptos({ vs = 'usd', perPage = 20 }){
  try{
    const key = `cg_top_${vs}_${perPage}`
    const cached = cacheGet(key)
    if(cached) return cached
    const { data } = await coingecko.get(`/api/v3/coins/markets`, { params: { vs_currency: vs, order: 'market_cap_desc', per_page: perPage, page: 1, sparkline: true } })
    cacheSet(key, data)
    return data
  }catch(err){ return handleRateLimit(err) }
}

// Stock APIs normalization
async function getQuoteFinnhub(symbol){
  if(!HAS_KEY) return (await loadMock('quote')) || { c: 150, dp: 0.5 }
  const { data } = await finnhub.get('/quote', { params: { symbol, token: env.VITE_STOCK_API_KEY } }).catch(handleRateLimit)
  return data
}

async function getCandleFinnhub(symbol, resolution, from, to){
  if(!HAS_KEY) return (await loadMock('candles')) || { t: [], c: [] }
  const { data } = await finnhub.get('/stock/candle', { params: { symbol, resolution, from, to, token: env.VITE_STOCK_API_KEY } }).catch(handleRateLimit)
  return data
}

export async function getStockQuote(symbol){
  if(PROVIDER === 'finnhub'){
    const q = await getQuoteFinnhub(symbol)
    return { price: q.c, changePct: q.dp }
  }
  // fallback generic
  return { price: 0, changePct: 0 }
}

export async function getStockCandles(symbol, range){
  const now = Math.floor(Date.now()/1000)
  const map = { '1d': 60, '7d': 60, '1m': 'D', '3m': 'D' }
  const resolution = map[range] || 60
  const from = range === '1d' ? now - 3600*24 : range === '7d' ? now - 3600*24*7 : range === '1m' ? now - 3600*24*30 : now - 3600*24*90
  const data = await getCandleFinnhub(symbol, resolution, from, now)
  return data
}

// Polling utility with backoff
export function createPoller(fn, onData){
  let timer
  let stopped = false
  const tick = async () => {
    if(stopped) return
    try {
      const d = await fn()
      onData(d)
      resetBackoff()
    } catch(e){ handleRateLimit(e) }
    timer = setTimeout(tick, backoff)
  }
  tick()
  return () => { stopped = true; if(timer) clearTimeout(timer) }
}
