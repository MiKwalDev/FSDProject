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
  }),
})

export const { useLazySearchGamesByNameQuery, useGetHomeDataQuery } =
  gamesApiSlice
