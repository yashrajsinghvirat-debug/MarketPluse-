/****/ // tests for API normalization
jest.mock('axios', () => {
  const real = jest.requireActual('axios')
  const instance = () => real
  instance.create = () => ({ get: jest.fn() })
  return instance
})

describe('api normalization', () => {
  beforeEach(()=>{ jest.resetModules(); localStorage.clear() })

  test('getStockQuote returns normalized data with mock when no key', async () => {
    process.env = { ...process.env, VITE_STOCK_API_PROVIDER: 'finnhub' }
    delete process.env.VITE_STOCK_API_KEY
    const api = await import('../services/api')
    const q = await api.getStockQuote('AAPL')
    expect(q).toHaveProperty('price')
    expect(q).toHaveProperty('changePct')
  })
})
