import { createSlice } from '@reduxjs/toolkit'

const LS_KEY = 'mp_watchlist'
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] } }
const save = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s))

const slice = createSlice({
  name: 'watchlist',
  initialState: { items: load() },
  reducers: {
    toggleWatch(state, action){
      const s = action.payload
      if(state.items.includes(s)) state.items = state.items.filter(x=>x!==s)
      else state.items.push(s)
      save(state.items)
    }
  }
})

export const { toggleWatch } = slice.actions
export default slice.reducer
