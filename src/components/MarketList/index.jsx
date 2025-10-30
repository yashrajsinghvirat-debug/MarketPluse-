import SymbolCard from '../SymbolCard'

export default function MarketList({ title, items=[], type }){
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((it)=> (
          <SymbolCard key={(type==='crypto'? it.id : it.symbol)} item={it} type={type} />
        ))}
      </div>
    </section>
  )
}
