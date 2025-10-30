import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

it('renders header', ()=>{
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  )
  expect(screen.getByText(/MarketPulse/i)).toBeInTheDocument()
})
