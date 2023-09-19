import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersList: builder.query({
      query: () => '/admin/userslist',
    }),
    getCurrentUserData: builder.query({
      query: credentials => ({
        url: '/dashboard/getuserdata',
        method: 'POST',
        body: {...credentials}
      }),
      providesTags: ['User']
    }),
    modifyProfil: builder.mutation({
      query: (arg) => {
        const { username, email } = arg
        return {
          url: '/dashboard/profil/update',
          method: 'UPDATE',
          params: { username, email },
        }
      },
      invalidatesTags: ['User']
    })
  })
})

export const {
  useGetUsersListQuery,
  useGetCurrentUserDataQuery,
  useModifyProfilMutation
} = usersApiSlice