import { Suspense, lazy, useEffect, useState } from 'react'
import { Link, Routes, Route, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, setCurrency } from './store/settingsSlice'
import useOnlineStatus from './hooks/useOnlineStatus'
import { getEnv } from './utils/env'

const Overview = lazy(() => import('./pages/Overview.jsx'))
const SymbolDetail = lazy(() => import('./pages/SymbolDetail.jsx'))
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))

export default function App() {
  const online = useOnlineStatus()
  const dispatch = useDispatch()
  const { theme, currency } = useSelector((s) => s.settings)
  const [missingKey, setMissingKey] = useState(false)

  useEffect(() => {
    const hasKey = !!getEnv().VITE_STOCK_API_KEY
    setMissingKey(!hasKey)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <header className="border-b sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
          <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
            <Link to="/" className="font-bold">MarketPulse</Link>
            <nav className="flex gap-3">
              <NavLink to="/" end className={({isActive})=> isActive? 'font-semibold' : ''}>Overview</NavLink>
              <NavLink to="/portfolio" className={({isActive})=> isActive? 'font-semibold' : ''}>My Portfolio</NavLink>
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <select aria-label="Currency" value={currency} onChange={(e)=>dispatch(setCurrency(e.target.value))} className="border rounded px-2 py-1 text-sm">
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
              <button aria-label="Toggle theme" onClick={()=>dispatch(setTheme(theme === 'dark' ? 'light':'dark'))} className="border rounded px-2 py-1 text-sm">{theme==='dark'? 'Light':'Dark'}</button>
            </div>
          </div>
          {!online && (
            <div className="bg-yellow-100 text-yellow-900 text-sm p-2 text-center">Offline. Showing cached data where available.</div>
          )}
          {missingKey && (
            <div className="bg-blue-100 text-blue-900 text-sm p-2 text-center">No stock API key set. Using mocked data. Add VITE_STOCK_API_KEY in .env to enable live quotes.</div>
          )}
        </header>

        <main className="max-w-6xl mx-auto p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/symbol/:type/:id" element={<SymbolDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
