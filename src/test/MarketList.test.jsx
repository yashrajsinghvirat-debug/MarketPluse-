import { render, screen } from '@testing-library/react'
import MarketList from '../components/MarketList'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../store/settingsSlice'
import watchlistReducer from '../store/watchlistSlice'
import { MemoryRouter } from 'react-router-dom'

const items = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 10000, price_change_percentage_24h: 1.2, sparkline_in_7d: { price: [1,2,3] } },
  { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 2000, price_change_percentage_24h: -0.5, sparkline_in_7d: { price: [1,2,1] } },
]

test('renders a list of symbols', ()=>{
  const store = configureStore({ reducer: { settings: settingsReducer, watchlist: watchlistReducer }, preloadedState: { settings: { theme: 'light', currency: 'USD' }, watchlist: { items: [] } } })
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MarketList title="Top Cryptos" items={items} type="crypto" />
      </MemoryRouter>
    </Provider>
  )
  expect(screen.getByText('Top Cryptos')).toBeInTheDocument()
  expect(screen.getByLabelText('Bitcoin details')).toBeInTheDocument()
  expect(screen.getByLabelText('Ethereum details')).toBeInTheDocument()
})
