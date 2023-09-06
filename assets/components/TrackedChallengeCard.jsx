import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useDispatch } from "react-redux"

import {
  useRemoveFromTrackedChallengesMutation,
  useToggleIsAbandonedMutation,
  useToggleIsDoneMutation,
} from "../features/challenges/challengesApiSlice"
import { removeChallengeFromTracked } from "../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

import ConfimDial from "./ConfimDial"

import "../styles/TrackedChallengeCard.css"

const TrackedChallengeCard = ({ trackedChallenge }) => {
  const msgRef = useRef()
  const [msg, setMsg] = useState("")
  const [checkConfirmDial, setCheckConfirmDial] = useState({
    show: false,
  })
  const [abandonConfirmDial, setAbandonConfirmDial] = useState({
    show: false,
  })
  const [deleteConfirmDial, setDeleteConfirmDial] = useState({
    show: false,
  })
  const [isChecked, setIsChecked] = useState(false)
  const [isAbandoned, setIsAbandoned] = useState(false)

  const [toggleIsDone] = useToggleIsDoneMutation()
  const [toggleIsAbandoned] = useToggleIsAbandonedMutation()
  const [removeFromTrackedChallenges] = useRemoveFromTrackedChallengesMutation()

  const dispatch = useDispatch()

  const handleOnChangeCheck = (e) => {
    e.preventDefault()

    setCheckConfirmDial({
      show: true,
    })
  }

  const handleCheckConfirmValidation = async (e) => {
    e.preventDefault()

    if (checkConfirmDial.show) {
      setCheckConfirmDial({
        show: false,
      })

      const toggleIsDoneResult = await toggleIsDone({
        trackedChallengeId: Number(trackedChallenge.id),
      }).unwrap()

      if (toggleIsDoneResult.error) {
        setMsg(toggleIsDoneResult.error)

        setTimeout(() => {
          setMsg("")
        }, 5000)
      } else if (toggleIsDoneResult.success) {
        setIsChecked(!isChecked)
      }
    }
  }

  const handleCheckConfirmCancel = (e) => {
    e.preventDefault()

    setCheckConfirmDial({
      show: false,
    })
  }

  const handleAbandonBtn = (e) => {
    e.preventDefault()

    setAbandonConfirmDial({
      show: true,
    })
  }

  const handleAbandonConfirmValidation = async (e) => {
    e.preventDefault()

    if (abandonConfirmDial.show) {
      setAbandonConfirmDial({
        show: false,
      })

      const toggleIsAbandonedResult = await toggleIsAbandoned({
        trackedChallengeId: Number(trackedChallenge.id),
      }).unwrap()

      if (toggleIsAbandonedResult.error) {
        setMsg(toggleIsAbandonedResult.error)

        setTimeout(() => {
          setMsg("")
        }, 5000)
      } else if (toggleIsAbandonedResult.success) {
        setIsAbandoned(!isAbandoned)
      }
    }
  }

  const handleAbandonConfirmCancel = (e) => {
    e.preventDefault()

    setAbandonConfirmDial({
      show: false,
    })
  }

  const handleDeleteBtn = (e) => {
    e.preventDefault()

    setDeleteConfirmDial({
      show: true,
    })
  }

  const handleDeleteConfirmValidation = async (e) => {
    e.preventDefault()

    if (deleteConfirmDial.show) {
      setDeleteConfirmDial({
        show: false,
      })

      const removeFromTrackedChallengesResult = await removeFromTrackedChallenges({
        trackedChallengeId: Number(trackedChallenge.id),
      }).unwrap()

      if (removeFromTrackedChallengesResult.error) {
        setMsg(removeFromTrackedChallengesResult.error)

        setTimeout(() => {
          setMsg("")
        }, 5000)
      } else if (removeFromTrackedChallengesResult.success) {
        dispatch(removeChallengeFromTracked(Number(trackedChallenge.id)))
      }
    }
  }

  const handleDeleteConfirmCancel = (e) => {
    e.preventDefault()

    setDeleteConfirmDial({
      show: false,
    })
  }

  useEffect(() => {
    msg !== "" && msgRef.current.focus()
  }, [msg])

  useEffect(() => {
    trackedChallenge.isDone && setIsChecked(true)
    trackedChallenge.isAbandoned && setIsAbandoned(true)
  }, [])

  const content = (
    <li>
      <ConfimDial
        isOpen={checkConfirmDial.show}
        subject={"complétion/non complété"}
        validationFunc={handleCheckConfirmValidation}
        cancelFunc={handleCheckConfirmCancel}
      />
      <ConfimDial
        isOpen={abandonConfirmDial.show}
        subject={"abandon/reprise"}
        validationFunc={handleAbandonConfirmValidation}
        cancelFunc={handleAbandonConfirmCancel}
      />
      <ConfimDial
        isOpen={deleteConfirmDial.show}
        subject={"suppression"}
        validationFunc={handleDeleteConfirmValidation}
        cancelFunc={handleDeleteConfirmCancel}
      />
      {msg !== "" && (
        <div className="messagefield">
          <small
            className={"message err-message"}
            ref={msgRef}
            aria-live="assertive"
          >
            {msg}
          </small>
        </div>
      )}
      <Link to={`/challenge/${trackedChallenge.challenge.id}`}>
        <h3>{trackedChallenge.challenge.name}</h3>
        <span>
          Voir les règles <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </Link>
      <div className="tracked-challenge-status">
        <div className="input-group">
          <label htmlFor="is_done" className="label">
            Complété:
          </label>
          <div className="custom-checkbox">
            <input
              type="checkbox"
              name="is_done"
              id="is_done"
              className={isChecked ? "checked" : ""}
              onChange={handleOnChangeCheck}
              checked={isChecked}
            />
          </div>
        </div>
      </div>
      <div className="tracked-challenge-buttons">
        {isAbandoned ? (
          <button className="btn retry-btn" onClick={handleAbandonBtn}>
            Reprendre
          </button>
        ) : (
          <button className="btn abandon-btn" onClick={handleAbandonBtn}>
            Abandonner
          </button>
        )}
        <button className="btn delete-btn" onClick={handleDeleteBtn}>
          Supprimer de ma liste
        </button>
      </div>
    </li>
  )
  return content
}

export default TrackedChallengeCard
