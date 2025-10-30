import { createSlice } from '@reduxjs/toolkit'
import { getEnv } from '../utils/env'

const env = getEnv()

function getInitialTheme(){
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('mp_theme') : null
  if (saved) return saved
  try {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {}
  return 'light'
}

const initialState = {
  theme: getInitialTheme(),
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
