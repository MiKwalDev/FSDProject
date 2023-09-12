import { createSlice } from "@reduxjs/toolkit"

const userBacklogSlice = createSlice({
  name: "backlog",
  initialState: { games: [] },
  reducers: {
    setGames: (state, action) => {
      const games = action.payload
      state.games = games
    },
    removeGameFromBacklog: (state, action) => {
      state.games.splice(
        state.games.findIndex((game) => game.id === action.payload),
        1
      )
    },
  },
})

export const { setGames, removeGameFromBacklog } = userBacklogSlice.actions

export default userBacklogSlice.reducer

export const selectCurrentBacklogGames = (state) => state.backlog.games
export const selectBacklogGameByGameId = (state, gameId) =>
  state.backlog.games.find((game) => game.gameId === gameId)
