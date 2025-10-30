import { formatCurrency, formatPct } from '../utils/format'

test('formatCurrency formats numbers', ()=>{
  const out = formatCurrency(1234.56, 'USD')
  expect(out).toMatch(/\$\s?1,234\.56|US\$\s?1,234\.56|USD\s?1,234\.56/)
})

test('formatPct formats percent', ()=>{
  expect(formatPct(1.234)).toBe('1.23%')
})
