import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addPosition } from '../../store/portfolioSlice'

export default function AddPosition(){
  const [symbol, setSymbol] = useState('AAPL')
  const [units, setUnits] = useState('1')
  const [type, setType] = useState('stock')
  const dispatch = useDispatch()
  return (
    <form className="flex gap-2" onSubmit={(e)=>{e.preventDefault(); dispatch(addPosition(symbol, units, type));}}>
      <select value={type} onChange={(e)=>setType(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="stock">Stock</option>
        <option value="crypto">Crypto</option>
      </select>
      <input className="border rounded px-2 py-1 text-sm" value={symbol} onChange={(e)=>setSymbol(e.target.value.toUpperCase())} aria-label="Symbol" />
      <input className="border rounded px-2 py-1 text-sm w-24" type="number" step="0.0001" value={units} onChange={(e)=>setUnits(e.target.value)} aria-label="Units" />
      <button className="border rounded px-3 py-1 text-sm">Add</button>
    </form>
  )
}
