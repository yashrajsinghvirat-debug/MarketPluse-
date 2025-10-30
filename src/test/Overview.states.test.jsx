import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../store/settingsSlice'
import watchlistReducer from '../store/watchlistSlice'
import Overview from '../pages/Overview'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../services/api', () => ({
  getTopCryptos: jest.fn(),
  getStockQuote: jest.fn(),
}))

function renderWithStore(){
  const store = configureStore({ reducer: { settings: settingsReducer, watchlist: watchlistReducer }, preloadedState: { settings: { theme: 'light', currency: 'USD' }, watchlist: { items: [] } } })
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Overview />
      </MemoryRouter>
    </Provider>
  )
}

test('shows loading states', async () => {
  const api = require('../services/api')
  api.getTopCryptos.mockResolvedValueOnce([])
  api.getStockQuote.mockResolvedValue({ price: 1, changePct: 0 })
  renderWithStore()
  expect(screen.getByText(/Loading stocks/i)).toBeInTheDocument()
  expect(screen.getByText(/Loading cryptos/i)).toBeInTheDocument()
  await waitFor(() => expect(api.getTopCryptos).toHaveBeenCalled())
})

test('shows error states', async () => {
  const api = require('../services/api')
  api.getTopCryptos.mockRejectedValueOnce(new Error('fail'))
  api.getStockQuote.mockRejectedValueOnce(new Error('fail'))
  renderWithStore()
  await waitFor(() => expect(screen.getByText(/Failed to load stocks/i)).toBeInTheDocument())
  expect(screen.getByText(/Failed to load cryptos/i)).toBeInTheDocument()
})

test('shows rate-limit banner on 429', async () => {
  const api = require('../services/api')
  const err429 = { response: { status: 429 } }
  api.getTopCryptos.mockRejectedValueOnce(err429)
  api.getStockQuote.mockRejectedValueOnce(err429)
  renderWithStore()
  await waitFor(() => {
    const alerts = screen.getAllByRole('alert')
    expect(alerts.some(a => /Rate limit/i.test(a.textContent))).toBe(true)
  })
})
