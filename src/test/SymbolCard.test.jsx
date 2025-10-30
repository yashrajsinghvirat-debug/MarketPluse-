import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../store/settingsSlice'
import watchlistReducer from '../store/watchlistSlice'
import { MemoryRouter } from 'react-router-dom'
jest.mock('../components/Chart/Sparkline', () => () => <div data-testid="sparkline" />)
import SymbolCard from '../components/SymbolCard'

function renderWithStore(ui, preloadedState){
  const store = configureStore({ reducer: { settings: settingsReducer, watchlist: watchlistReducer }, preloadedState })
  return { ...render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>), store }
}

test('toggles watchlist star', ()=>{
  const item = { id: 'bitcoin', name: 'Bitcoin', current_price: 100, price_change_percentage_24h: 1, sparkline_in_7d: { price: [1,2,3] } }
  renderWithStore(<SymbolCard item={item} type="crypto" />, { settings: { theme: 'light', currency: 'USD' }, watchlist: { items: [] } })
  const btn = screen.getByTitle('Watchlist')
  expect(btn).toBeInTheDocument()
  fireEvent.click(btn)
  // star should now be active (style change)
  expect(btn.className).toMatch(/text-yellow-500|text-gray-400/)
})
