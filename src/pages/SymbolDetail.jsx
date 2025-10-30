import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStockCandles, getStockQuote } from '../services/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../utils/format'
import { useSelector } from 'react-redux'

const ranges = ['1d','7d','1m','3m']

export default function SymbolDetail(){
  const { type, id } = useParams()
  const [range, setRange] = useState('7d')
  const [data, setData] = useState(null)
  const { currency } = useSelector(s=>s.settings)

  useEffect(()=>{
    if(type==='stock'){
      getStockCandles(id, range).then(setData).catch(()=>setData(null))
    } else {
      setData(null) // crypto charts can be added via CoinGecko market_chart
    }
  }, [id, type, range])

  const chartData = useMemo(()=>{
    if(!data || !data.t) return []
    return data.t.map((t, i)=> ({ time: new Date(t*1000).toLocaleString(), price: data.c[i] }))
  }, [data])

  const [quote, setQuote] = useState(null)
  useEffect(()=>{ if(type==='stock') getStockQuote(id).then(setQuote) }, [id, type])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{id}</h1>
      {quote && (
        <div className="text-sm">{formatCurrency(quote.price, currency)}</div>
      )}
      <div className="flex gap-2">
        {ranges.map(r => (
          <button key={r} onClick={()=>setRange(r)} className={`px-2 py-1 border rounded text-sm ${range===r?'font-semibold':''}`}>{r}</button>
        ))}
      </div>
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis dataKey="price" domain={['auto','auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
