import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import gamesReducer from '../features/igdb/gamesSlice'
import backlogReducer from '../features/userBacklog/userBacklogSlice'
import challengesReducer from '../features/challenges/challengesSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    games: gamesReducer,
    backlog: backlogReducer,
    challenges: challengesReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})