import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function Sparkline({ data=[], color='#10b981' }){
  const points = (data || []).map((y, i) => ({ i, y }))
  return (
    <div style={{ width: 120, height: 36 }} aria-hidden>
      <ResponsiveContainer>
        <LineChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <Line type="monotone" dataKey="y" stroke={color} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
