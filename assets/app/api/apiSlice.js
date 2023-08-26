import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logOut } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.token
    if (endpoint === 'refresh') {
      return headers
    } else if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    console.log("sending refresh token")
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/token/refresh", { ...api, endpoint: 'refresh' }, extraOptions)
    if (refreshResult?.data) {
      const username = api.getState().auth.username
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, username }))
      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})