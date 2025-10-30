import { computePortfolioValue } from '../utils/portfolio'

test('computePortfolioValue sums units * price', ()=>{
  const positions = [
    { symbol: 'AAPL', units: 2 },
    { symbol: 'MSFT', units: 3 },
  ]
  const priceMap = { AAPL: { price: 10 }, MSFT: { price: 20 } }
  expect(computePortfolioValue(positions, priceMap)).toBe(2*10 + 3*20)
})
