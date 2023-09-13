import { apiSlice } from "../../app/api/apiSlice"

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAdminData: builder.query({
      query: credentials => ({
        url: '/admin',
        method: 'POST',
        body: {...credentials}
      }),
      providesTags: ['Admin']
    }),
  })
})

export const { useGetAdminDataQuery } = adminApiSlice