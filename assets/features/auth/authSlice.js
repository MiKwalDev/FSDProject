import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userId: null,
  username: null,
  userEmail: null,
  userCreatedAt: null,
  userRoles: null,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { data, token } = action.payload
      state.userId = data.userId
      state.username = data.username
      state.userEmail = data.userEmail
      state.userCreatedAt = data.userCreatedAt.date
      state.userRoles = data.roles
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
        userEmail: null,
        userCreatedAt: null,
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
export const selectCurrentUserEmail = (state) => state.auth.userEmail
export const selectCurrentUserCreatedAt = (state) => state.auth.userCreatedAt
export const selectCurrentUserRoles = (state) => state.auth.userRoles
export const selectCurrentToken = (state) => state.auth.token
