import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userId: null,
  username: null,
  userRoles: null,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
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
    setUserRoles: (state, action) => {
      state.userRoles = action.payload
    },
    logOut: (state, action) => {
      state = {
        userId: null,
        username: null,
        userRoles: null,
        token: null,
      }
    },
  },
})

export const { setCredentials, setUserId, setUserRoles, logOut } =
  authSlice.actions

export default authSlice.reducer

export const selectCurrentUserId = (state) => state.auth.userId
export const selectCurrentUser = (state) => state.auth.username
export const selectCurrentUserRoles = (state) => state.auth.userRoles
export const selectCurrentToken = (state) => state.auth.token
