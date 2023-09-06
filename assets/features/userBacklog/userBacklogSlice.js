import { createSlice } from "@reduxjs/toolkit"

const userBacklogSlice = createSlice({
  name: "backlog",
  initialState: { games: [] },
  reducers: {
    setGames: (state, action) => {
      const games = action.payload
      state.games = games
    },
  },
})

export const { setGames } = userBacklogSlice.actions

export default userBacklogSlice.reducer

export const selectCurrentBacklogGames = (state) => state.backlog.games
export const selectBacklogGameByGameId = (state, gameId) =>
  state.backlog.games.find((game) => game.gameId === gameId)
