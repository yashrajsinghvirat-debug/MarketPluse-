import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from '../store/portfolioSlice'
import settingsReducer from '../store/settingsSlice'
import Portfolio from '../pages/Portfolio'

function renderWithStore(){
  const store = configureStore({ reducer: { portfolio: portfolioReducer, settings: settingsReducer }, preloadedState: { portfolio: { positions: [] }, settings: { theme: 'light', currency: 'USD' } } })
  const utils = render(<Provider store={store}><Portfolio /></Provider>)
  return { ...utils, store }
}

test('add-to-portfolio flow via form', ()=>{
  renderWithStore()
  const symbol = screen.getByLabelText('Symbol')
  const units = screen.getByLabelText('Units')
  fireEvent.change(symbol, { target: { value: 'AAPL' } })
  fireEvent.change(units, { target: { value: '2' } })
  fireEvent.click(screen.getByText('Add'))
  expect(screen.getByText('AAPL')).toBeInTheDocument()
})
