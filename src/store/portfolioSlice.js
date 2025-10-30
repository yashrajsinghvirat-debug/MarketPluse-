import { createSlice, nanoid } from '@reduxjs/toolkit'

const load = () => {
  try { return JSON.parse(localStorage.getItem('mp_portfolio')||'[]') } catch { return [] }
}
const save = (s) => localStorage.setItem('mp_portfolio', JSON.stringify(s))

const slice = createSlice({
  name: 'portfolio',
  initialState: { positions: load() },
  reducers: {
    addPosition: {
      reducer(state, action){ state.positions.push(action.payload); save(state.positions) },
      prepare(symbol, units, type){ return { payload: { id: nanoid(), symbol, units: Number(units), type } } }
    },
    updateUnits(state, action){ const p = state.positions.find(x=>x.id===action.payload.id); if(p){ p.units = Number(action.payload.units); save(state.positions) } },
    removePosition(state, action){ state.positions = state.positions.filter(p=>p.id!==action.payload); save(state.positions) },
    clear(state){ state.positions = []; save(state.positions) }
  }
})

export const { addPosition, updateUnits, removePosition, clear } = slice.actions
export default slice.reducer
