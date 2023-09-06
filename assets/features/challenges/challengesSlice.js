import { createSelector, createSlice } from "@reduxjs/toolkit"

const initialState = {
  userCreatedChallenges: [],
  userTrackedChallenges: [],
}

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    setUserCreatedChallenges: (state, action) => {
      state.userCreatedChallenges = action.payload
    },
    setUserTrackedChallenges: (state, action) => {
      state.userTrackedChallenges = action.payload
    },
    addNewCreatedChallenge: (state, action) => {
      state.userCreatedChallenges.push(action.payload)
    },
    addChallengeToTracked: (state, action) => {
      state.userTrackedChallenges.push(action.payload)
    },
    removeChallengeFromTracked: (state, action) => {
      state.userTrackedChallenges.splice(
        state.userTrackedChallenges.findIndex(
          (challenge) => challenge.id === action.payload
        ),
        1
      )
    },
  },
})

export const {
  setUserCreatedChallenges,
  setUserTrackedChallenges,
  addNewCreatedChallenge,
  addChallengeToTracked,
  removeChallengeFromTracked,
} = challengesSlice.actions

export default challengesSlice.reducer

export const selectUserCreatedChallenges = (state) =>
  state.challenges.userCreatedChallenges

export const selectUserTrackedChallenges = (state) =>
  state.challenges.userTrackedChallenges

export const selectUserCreatedChallengesByGame = createSelector(
  [selectUserCreatedChallenges, (state, gameId) => gameId],
  (challenges, gameId) =>
    challenges.filter((challenge) => challenge.gameId === gameId)
)

export const selectUserTrackedChallengesByGame = createSelector(
  [selectUserTrackedChallenges, (state, gameId) => gameId],
  (challenges, gameId) =>
    challenges.filter((challenge) => challenge.challenge.gameId === gameId)
)

export const selectUserActivesTrackedChallenges = createSelector(
  [selectUserTrackedChallenges, (state, isDone) => isDone],
  (challenges, isDone) =>
    challenges.filter((challenge) => challenge.isDone === isDone && challenge.isAbandoned === isDone)
)
