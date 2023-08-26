import { apiSlice } from "../../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/login_check',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    logout: builder.mutation({
      query: () => '/token/invalidate',
    }),
  })
})

export const {
  useLoginMutation,
  useLogoutMutation
} = authApiSlice