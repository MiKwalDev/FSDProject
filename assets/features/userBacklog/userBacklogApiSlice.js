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
  })
})

export const {
  useAddGameToBacklogMutation
} = userBacklogApiSlice