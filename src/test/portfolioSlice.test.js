import reducer, { addPosition, updateUnits, removePosition, clear } from '../store/portfolioSlice'

function stateClone(s){ return JSON.parse(JSON.stringify(s)) }

beforeEach(()=>{ localStorage.clear() })

test('add, update, remove position', ()=>{
  let state = { positions: [] }
  state = reducer(state, addPosition('AAPL', 2, 'stock'))
  expect(state.positions).toHaveLength(1)
  const id = state.positions[0].id
  state = reducer(state, updateUnits({ id, units: 5 }))
  expect(state.positions[0].units).toBe(5)
  state = reducer(state, removePosition(id))
  expect(state.positions).toHaveLength(0)
})

test('clear portfolio', ()=>{
  let state = { positions: [] }
  state = reducer(state, addPosition('BTC', 0.1, 'crypto'))
  expect(state.positions.length).toBe(1)
  state = reducer(state, clear())
  expect(state.positions.length).toBe(0)
})
