import { useEffect, useMemo, useState } from 'react'
import MarketList from '../components/MarketList'
import { getTopCryptos, getStockQuote } from '../services/api'
import { useSelector } from 'react-redux'

const TOP_STOCKS = ['AAPL','MSFT','NVDA','AMZN','GOOGL','META','TSLA','BRK.B','AVGO','LLY','JPM','WMT','XOM','V','MA','UNH','PG','HD','ORCL','KO']

export default function Overview(){
  const [cryptos, setCryptos] = useState([])
  const [stocks, setStocks] = useState([])
  const [q, setQ] = useState('')
  const watch = useSelector(s=>s.watchlist.items)
  const [loadingCrypto, setLoadingCrypto] = useState(true)
  const [loadingStocks, setLoadingStocks] = useState(true)
  const [cryptoError, setCryptoError] = useState(null)
  const [stocksError, setStocksError] = useState(null)
  const [rateLimited, setRateLimited] = useState(false)

  useEffect(()=>{
    setLoadingCrypto(true)
    getTopCryptos({ vs: 'usd', perPage: 20 })
      .then(d=>{ setCryptos(d); setCryptoError(null) })
      .catch(e=>{ setCryptoError(e); if(e?.response?.status===429) setRateLimited(true) })
      .finally(()=> setLoadingCrypto(false))

    setLoadingStocks(true)
    Promise.all(TOP_STOCKS.map(async s=>({ symbol: s, ...(await getStockQuote(s)) })))
      .then(d=>{ setStocks(d); setStocksError(null) })
      .catch(e=>{ setStocksError(e); if(e?.response?.status===429) setRateLimited(true) })
      .finally(()=> setLoadingStocks(false))
  },[])

  const filteredCryptos = useMemo(()=> cryptos.filter(c=> (c.name||'').toLowerCase().includes(q.toLowerCase()) || (c.symbol||'').toLowerCase().includes(q.toLowerCase())), [cryptos, q])
  const filteredStocks = useMemo(()=> stocks.filter(s=> (s.symbol||'').toLowerCase().includes(q.toLowerCase())), [stocks, q])
  const watchlistItems = useMemo(()=> {
    const stockItems = filteredStocks.filter(s=> watch.includes(s.symbol))
    const cryptoItems = filteredCryptos.filter(c=> watch.includes(c.id))
    return { stockItems, cryptoItems }
  }, [filteredStocks, filteredCryptos, watch])

  return (
    <div className="grid gap-8">
      <div className="flex items-center gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search symbols..." className="border rounded px-3 py-2 w-full md:w-80" aria-label="Search" />
      </div>
      {rateLimited && (
        <div role="alert" className="text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded p-2">Rate limit reached. Slowing updates automatically.</div>
      )}
      {(watch.length>0) && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Watchlist</h2>
          <MarketList title="Stocks" items={watchlistItems.stockItems} type="stock" />
          <MarketList title="Cryptos" items={watchlistItems.cryptoItems} type="crypto" />
        </div>
      )}
      {loadingStocks ? <div aria-live="polite">Loading stocks...</div> : stocksError ? <div role="alert" className="text-red-600">Failed to load stocks</div> : <MarketList title="Top Stocks" items={stocks} type="stock" />}
      {loadingCrypto ? <div aria-live="polite">Loading cryptos...</div> : cryptoError ? <div role="alert" className="text-red-600">Failed to load cryptos</div> : <MarketList title="Top Cryptos" items={filteredCryptos} type="crypto" />}
    </div>
  )
}
