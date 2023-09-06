import { apiSlice } from "../../app/api/apiSlice"

export const challengesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createChallenge: builder.mutation({
      query: (arg) => {
        const { name, rules, status, gameId } = arg
        return {
          url: '/dashboard/challenge/create',
          method: 'POST',
          params: { name, rules, gameId, status },
        }
      },
      invalidatesTags: ['User']
    }),
    addToTrackedChallenges: builder.mutation({
      query: (arg) => {
        const { challengeId } = arg
        return {
          url: '/dashboard/challenge/addtotracked',
          method: 'POST',
          params: { challengeId }
        }
      },
      invalidatesTags: ['User']
    }),
    toggleIsDone: builder.mutation({
      query: (arg) => {
        const { trackedChallengeId } = arg
        return {
          url: '/dashboard/trackedchallenge/toggleisdone',
          method: 'POST',
          params: { trackedChallengeId }
        }
      },
      invalidatesTags: ['User']
    }),
    toggleIsAbandoned: builder.mutation({
      query: (arg) => {
        const { trackedChallengeId } = arg
        return {
          url: '/dashboard/trackedchallenge/toggleisabandoned',
          method: 'POST',
          params: { trackedChallengeId }
        }
      },
      invalidatesTags: ['User']
    }),
    removeFromTrackedChallenges: builder.mutation({
      query: (arg) => {
        const { trackedChallengeId } = arg
        return {
          url: '/dashboard/trackedchallenge/delete',
          method: 'DELETE',
          params: { trackedChallengeId }
        }
      },
      invalidatesTags: ['User']
    })
  })
})

export const {
  useCreateChallengeMutation,
  useAddToTrackedChallengesMutation,
  useToggleIsDoneMutation,
  useToggleIsAbandonedMutation,
  useRemoveFromTrackedChallengesMutation
} = challengesApiSlice