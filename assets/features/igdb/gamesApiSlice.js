import { apiSlice } from "../../app/api/apiSlice"

export const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchGamesByName: builder.query({
      query: (arg) => {
        const { gameName } = arg
        return {
          url: "/dashboard/searchgames",
          method: "POST",
          params: { gameName },
        }
      },
    }),
    getHomeData: builder.query({
      query: () => "/home/homedata",
      providesTags: ["HomeData"],
    }),
    getGameData: builder.query({
      query: (gameId) => `/game/getgamedata?gameId=${gameId}`,
    }),
    getGameCover: builder.query({
      query: (gameId) => `/game/getgamecover?gameId=${gameId}`,
    }),
  }),
})

export const {
  useLazySearchGamesByNameQuery,
  useGetHomeDataQuery,
  useGetGameDataQuery,
  useGetGameCoverQuery,
} = gamesApiSlice
