export function formatCurrency(v, currency='USD'){
  try{ return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(v ?? 0) }catch{ return `${currency} ${Number(v||0).toFixed(2)}` }
}
export function formatPct(v){ return `${(Number(v)||0).toFixed(2)}%` }
