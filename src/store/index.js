import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'
import portfolioReducer from './portfolioSlice'
import watchlistReducer from './watchlistSlice'

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    portfolio: portfolioReducer,
    watchlist: watchlistReducer,
  },
})
