import { createSlice } from '@reduxjs/toolkit'
import { getEnv } from '../utils/env'

const env = getEnv()

const initialState = {
  theme: (localStorage.getItem('mp_theme') || 'light'),
  currency: (localStorage.getItem('mp_currency') || (env.VITE_DEFAULT_CURRENCY || 'USD')),
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action){ state.theme = action.payload; localStorage.setItem('mp_theme', state.theme) },
    setCurrency(state, action){ state.currency = action.payload; localStorage.setItem('mp_currency', state.currency) },
  }
})

export const { setTheme, setCurrency } = slice.actions
export default slice.reducer
