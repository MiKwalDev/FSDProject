import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userId: null,
  username: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { username, token } = action.payload
      state.username = username
      state.token = token
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    logOut: (state) => {
      state.username = null,
      state.token = null
    }
  }
})

export const { setCredentials, setUserId, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUserId = (state) => state.auth.userId
export const selectCurrentUser = (state) => state.auth.username
export const selectCurrentToken = (state) => state.auth.token