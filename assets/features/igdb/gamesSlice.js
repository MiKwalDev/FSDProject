import { createSlice } from "@reduxjs/toolkit"

const gamesSlice = createSlice({
  name: "games",
  initialState: { userSearchEntry: "" },
  reducers: {
    searchGames: (state, action) => {
      state.userSearchEntry = action.payload
    },
    clearSearchGames: (state) => {
      state.userSearchEntry = ""
    }
  }
})

export const { searchGames, clearSearchGames } = gamesSlice.actions

export default gamesSlice.reducer

export const selectUserSearchEntry = (state) => state.games.userSearchEntry