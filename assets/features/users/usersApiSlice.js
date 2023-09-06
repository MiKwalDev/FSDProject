import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserData: builder.query({
      query: credentials => ({
        url: '/dashboard',
        method: 'POST',
        body: {...credentials}
      }),
      providesTags: ['User']
    }),
  })
})

export const {
  useGetCurrentUserDataQuery
} = usersApiSlice