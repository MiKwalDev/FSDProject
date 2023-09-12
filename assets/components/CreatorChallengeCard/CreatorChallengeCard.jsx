import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUserId } from "../../features/auth/authSlice"
import { useAddToTrackedChallengesMutation } from "../../features/challenges/challengesApiSlice"
import { addChallengeToTracked } from "../../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons"

import "./CreatorChallengeCard.css"

const CreatorChallengeCard = ({ creatorChallenge }) => {
  const userId = useSelector(selectCurrentUserId)
  const msgRef = useRef()
  const [msg, setMsg] = useState([])

  const dispatch = useDispatch()

  const [addToTrackedChallenges, { isLoading }] =
    useAddToTrackedChallengesMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitResult = await addToTrackedChallenges({
      challengeId: Number(creatorChallenge.id),
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
    <li>
      <Link to={`/challenge/${creatorChallenge.id}`}>
        <h3>{creatorChallenge.name}</h3>
        <span>
          Voir les règles <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </Link>
      <span className="challenge-status">
        <FontAwesomeIcon
          icon={faCircle}
          className={"circle " + creatorChallenge.status}
        />
        {creatorChallenge.status === "private" && " Privé"}
        {creatorChallenge.status === "public" && " Publique"}
        {creatorChallenge.status === "pending" && " En attente validation"}
      </span>
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
    </li>
  )
  return content
}

export default CreatorChallengeCard
