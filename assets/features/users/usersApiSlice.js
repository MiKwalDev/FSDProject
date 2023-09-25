import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersList: builder.query({
      query: () => '/admin/userslist',
      providesTags: ["UsersList"]
    }),
    getCurrentUserData: builder.query({
      query: credentials => ({
        url: '/dashboard/getuserdata',
        method: 'POST',
        body: {...credentials}
      }),
      providesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: '/admin/user/delete',
        method: 'DELETE',
        params: userId
      }),
      invalidatesTags: ["UsersList"]
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
  useDeleteUserMutation,
  useModifyProfilMutation
} = usersApiSlice