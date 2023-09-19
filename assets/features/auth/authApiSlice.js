import { apiSlice } from "../../app/api/apiSlice"
import { setUserCreatedChallenges, setUserTrackedChallenges } from "../challenges/challengesSlice"
import { setGames } from "../userBacklog/userBacklogSlice"
import { setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/login_check',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    logout: builder.query({
      query: () => '/token/invalidate',
      invalidatesTags: ["Home"]
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/token/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ ...data }))
          dispatch(setGames(data.data.games))
          dispatch(setUserCreatedChallenges(data.data.createdChallenges))
          dispatch(setUserTrackedChallenges(data.data.trackedChallenges))
        } catch (err) {
          console.log(err)
        }
      },
      invalidatesTags: ["User"],
    })
  })
})

export const {
  useLoginMutation,
  useLazyLogoutQuery,
  useRefreshMutation,
} = authApiSlice