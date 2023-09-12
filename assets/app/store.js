import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import gamesReducer from '../features/igdb/gamesSlice'
import backlogReducer from '../features/userBacklog/userBacklogSlice'
import challengesReducer from '../features/challenges/challengesSlice'

const combinedReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  games: gamesReducer,
  backlog: backlogReducer,
  challenges: challengesReducer,
})

const rootReducer = (state, action) => {
  if (action.type === "auth/logOut") {
    state = undefined
  }
  return combinedReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})