import React, { useEffect, useRef, useState } from "react"

import { useDispatch, useSelector } from "react-redux"

import { addChallengeToTracked } from "../features/challenges/challengesSlice"
import { useAddToTrackedChallengesMutation } from "../features/challenges/challengesApiSlice"
import { selectCurrentUserId } from "../features/auth/authSlice"

const AddToTrackedChallengesForm = ({ challengeId }) => {
  const userId = useSelector(selectCurrentUserId)
  const msgRef = useRef()
  const [msg, setMsg] = useState([])

  const dispatch = useDispatch()

  const [addToTrackedChallenges, { isLoading }] =
    useAddToTrackedChallengesMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitResult = await addToTrackedChallenges({
      challengeId: Number(challengeId),
    }).unwrap()

    if (submitResult.error) {
      setMsg(submitResult)
    } else if (submitResult.success) {
      dispatch(
        addChallengeToTracked({
          id: submitResult.trackedChallengeId,
          challenge: submitResult.challenge,
          user: userId,
          isDone: false,
          isAbandoned: false,
          addedAt: submitResult.trackedChallengeAddedAt,
        })
      )
      setMsg(submitResult)
    }

    setTimeout(() => {
      setMsg([])
    }, 5000)
  }

  useEffect(() => {
    msg.length !== 0 && msgRef.current.focus()
  }, [msg])

  const content = (
    <div className="add-to-tracked-challenges">
      {msg.length !== 0 ? (
        <div className="messagefield">
          <small
            className={
              msg.success ? "message success-message" : "message err-message"
            }
            ref={msgRef}
            aria-live="assertive"
          >
            {msg.success || msg.error}
          </small>
        </div>
      ) : (
        <form className="add-to-tracked-challenges" onSubmit={handleSubmit}>
          <button className="btn">Ajouter à mes challenges en cours</button>
        </form>
      )}
    </div>
  )

  return content
}

export default AddToTrackedChallengesForm
