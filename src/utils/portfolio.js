export function computePortfolioValue(positions, priceMap){
  // priceMap: { [symbol]: { price: number } }
  return positions.reduce((sum, p)=>{
    const sym = p.symbol
    const price = priceMap?.[sym]?.price ?? 0
    return sum + (Number(p.units)||0) * price
  }, 0)
}
