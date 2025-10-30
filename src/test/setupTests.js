import '@testing-library/jest-dom'
// Mock ResizeObserver for Recharts ResponsiveContainer
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserverMock
}
// Mock ResponsiveContainer to render children directly in tests
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts')
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  }
})
