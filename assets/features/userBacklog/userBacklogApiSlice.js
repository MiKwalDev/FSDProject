import { apiSlice } from "../../app/api/apiSlice"

export const userBacklogApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addGameToBacklog: builder.mutation({
      query: (arg) => {
        const { gameId, gameName, gameCover } = arg
        return {
          url: '/dashboard/backlog/addgame',
          method: 'POST',
          params: { gameId, gameName, gameCover },
        }
      },
      invalidatesTags: ['User']
    }),
    getGameInfos: builder.query({
      query: gameId => `/dashboard/backlog/game/?gameId=${gameId}`
    }),
    removeFromBacklog: builder.mutation({
      query: (arg) => {
        const { backlogGameId } = arg
        return {
          url: '/dashboard/backlog/delete',
          method: 'DELETE',
          params: { backlogGameId }
        }
      },
      invalidatesTags: ['User']
    }),
  })
})

export const {
  useAddGameToBacklogMutation,
  useGetGameInfosQuery,
  useRemoveFromBacklogMutation
} = userBacklogApiSlice