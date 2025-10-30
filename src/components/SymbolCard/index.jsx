import { Link } from 'react-router-dom'
import Sparkline from '../Chart/Sparkline'
import { useDispatch, useSelector } from 'react-redux'
import { formatCurrency, formatPct } from '../../utils/format'
import { toggleWatch } from '../../store/watchlistSlice'

export default function SymbolCard({ item, type }){
  const { currency } = useSelector(s=>s.settings)
  const watched = useSelector(s=>s.watchlist.items)
  const dispatch = useDispatch()
  const price = type==='crypto' ? item.current_price : item.price
  const changePct = type==='crypto' ? item.price_change_percentage_24h : item.changePct
  const id = type==='crypto' ? item.id : item.symbol
  const name = type==='crypto' ? item.name : item.symbol
  const spark = type==='crypto' ? (item.sparkline_in_7d?.price||[]) : []
  const color = (changePct||0) >= 0 ? '#16a34a' : '#dc2626'
  return (
    <div className="border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition flex items-center gap-3">
      <button
        className={`text-xl leading-none ${watched.includes(id)?'text-yellow-500':'text-gray-400'}`}
        aria-label={watched.includes(id)? 'Remove from watchlist':'Add to watchlist'}
        onClick={()=>dispatch(toggleWatch(id))}
        title="Watchlist"
      >★</button>
      <Link to={`/symbol/${type}/${id}`} className="flex items-center gap-3 flex-1" aria-label={`${name} details`}>
        <div className="font-semibold w-24">{name}</div>
        <div className="ml-auto text-right">
          <div className="text-sm">{formatCurrency(price, currency)}</div>
          <div className={`text-xs ${changePct>=0?'text-green-600':'text-red-600'}`}>{formatPct(changePct)}</div>
        </div>
        <Sparkline data={spark} color={color} />
      </Link>
    </div>
  )
}
