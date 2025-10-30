import { useSelector, useDispatch } from 'react-redux'
import { removePosition, updateUnits, clear } from '../store/portfolioSlice'
import AddPosition from '../components/Portfolio/AddPosition'

export default function Portfolio(){
  const positions = useSelector(s=>s.portfolio.positions)
  const dispatch = useDispatch()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">My Portfolio</h1>
        <button className="ml-auto text-sm border rounded px-2 py-1" onClick={()=>dispatch(clear())}>Clear</button>
      </div>
      <AddPosition />
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900">
            <th className="text-left p-2 border">Type</th>
            <th className="text-left p-2 border">Symbol</th>
            <th className="text-right p-2 border">Units</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(p=> (
            <tr key={p.id}>
              <td className="p-2 border">{p.type}</td>
              <td className="p-2 border">{p.symbol}</td>
              <td className="p-2 border text-right">
                <input className="border rounded px-2 py-1 w-24 text-right" type="number" step="0.0001" value={p.units} onChange={(e)=>dispatch(updateUnits({ id: p.id, units: e.target.value }))}/>
              </td>
              <td className="p-2 border text-center">
                <button className="border rounded px-2 py-1" onClick={()=>dispatch(removePosition(p.id))}>Remove</button>
              </td>
            </tr>
          ))}
          {positions.length===0 && (
            <tr><td className="p-2 border text-center" colSpan="4">No positions yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
