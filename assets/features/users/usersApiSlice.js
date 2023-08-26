import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
    getCurrentUserData: builder.query({
      query: credentials => ({
        url: '/dashboard',
        method: 'POST',
        body: {...credentials}
      })
    }),
  })
})

export const {
  useGetUsersQuery,
  useGetCurrentUserDataQuery
} = usersApiSlice