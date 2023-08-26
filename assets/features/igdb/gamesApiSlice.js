import { apiSlice } from "../../app/api/apiSlice"

export const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGames: builder.query({
      query: () => '/game',
    })
  })
})

export const {
  useGetGamesQuery
} = gamesApiSlice