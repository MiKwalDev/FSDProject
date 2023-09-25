import React, { useEffect, useRef, useState } from "react"

import { useTitle } from "../../hooks/useTitle"
import { useParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import {
  useAddToTrackedChallengesMutation,
  useGetChallengeDataQuery,
  useSetChallengeStatusMutation,
} from "../../features/challenges/challengesApiSlice"
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectCurrentUserRoles,
} from "../../features/auth/authSlice"

import {
  addChallengeToTracked,
  selectUserTrackedChallenges,
} from "../../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"

import formatDate from "../../utils/formatDate/formatDate"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

import "./Challenge.css"
import {
  addGameToBacklog,
  selectCurrentBacklogGames,
} from "../../features/userBacklog/userBacklogSlice"
import { useAddGameToBacklogMutation } from "../../features/userBacklog/userBacklogApiSlice"
import EditChallengeForm from "../../components/EditChallengeForm/EditChallengeForm"

const Challenge = () => {
  const { challengeId } = useParams()
  const user = useSelector(selectCurrentUser)
  const userId = useSelector(selectCurrentUserId)
  const userRoles = useSelector(selectCurrentUserRoles)
  const userBacklog = useSelector(selectCurrentBacklogGames)
  const userTrackedChallenges = useSelector(selectUserTrackedChallenges)
  const [isEditing, setIsEditing] = useState(false)
  const msgRef = useRef()
  const [msg, setMsg] = useState(null)

  const dispatch = useDispatch()

  const [setChallengeStatus] = useSetChallengeStatusMutation()
  const [addToTrackedChallenges] = useAddToTrackedChallengesMutation()
  const [addGame] = useAddGameToBacklogMutation()

  const {
    data: challengeData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetChallengeDataQuery(challengeId)

  useTitle(`${challengeData?.gameName}: ${challengeData?.challenge?.name}`)

  const handleAddToBacklog = async (e) => {
    e.preventDefault()

    const addGameResult = await addGame({
      gameId: challengeData.challenge.game_id,
      gameName: challengeData.gameName,
      gameCover: challengeData.imgUrl2x,
    }).unwrap()

    if (addGameResult.error) {
      setMsg(addGameResult.error)

      setTimeout(() => {
        setMsg(null)
      }, 5000)
    } else if (addGameResult.success) {
      dispatch(
        addGameToBacklog({
          id: addGameResult.userGameId,
          gameId: challengeData.challenge.game_id,
          gameName: challengeData.gameName,
          gameCoverUrl: challengeData.imgUrl2x,
          user: userId,
          addedAt: addGameResult.addedAt,
        })
      )
    }

    setMsg(addGameResult)

    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  const handleAddToTracked = async (e) => {
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
      setMsg(null)
    }, 5000)
  }

  const validatePublication = async (e) => {
    e.preventDefault()

    const validateResult = await setChallengeStatus({
      challengeId: Number(challengeId),
      status: "public",
    }).unwrap()

    if (validateResult.error) {
      setMsg(validateResult)
    } else if (validateResult.success) {
      setMsg(validateResult)
    }

    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  const refusePublication = async (e) => {
    e.preventDefault()

    const refuseResult = await setChallengeStatus({
      challengeId: Number(challengeId),
      status: "private",
    }).unwrap()

    if (refuseResult.error) {
      setMsg(refuseResult)
    } else if (refuseResult.success) {
      setMsg(refuseResult)
    }

    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  const editPublication = (e) => {
    e.preventDefault()

    setIsEditing(!isEditing)
  }

  useEffect(() => {
    msg !== null && msgRef.current.focus()
  }, [msg])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess && challengeData === "Page inaccessible") {
    content = (
      <section className="container challenge">
        <div className="messagefield">
          <small className="message err-message">Page inaccessible</small>
        </div>
      </section>
    )
  } else if (isSuccess && challengeData?.challenge) {
    content = (
      <section className="container challenge">
        <div
          className="challenge-name"
          style={{ backgroundImage: `url(${challengeData.imgUrl})` }}
        >
          <div className="challenge-title-wrapper">
            <h1>{challengeData.challenge.name}</h1>
          </div>
        </div>

        <article className="challenge-infos">
          <div className="title">
            <h2>Jeu: {challengeData.gameName}</h2>
            <hr />
          </div>

          <div className="creation-infos">
            <span>
              Créé par {challengeData.challenge.creator?.username ? challengeData.challenge.creator?.username : "Utilisateur supprimé"} le{" "}
              {formatDate(challengeData.challenge.created_at)}
            </span>

            <span className="challenge-status">
              {"Status: "}
              <FontAwesomeIcon
                icon={faCircle}
                className={"circle " + challengeData.challenge.status}
              />
              {challengeData.challenge.status === "private" && " Privé"}
              {challengeData.challenge.status === "public" && " Publique"}
              {challengeData.challenge.status === "pending" &&
                " En attente validation"}
            </span>

            {user &&
              userTrackedChallenges.find(
                (trackedChallenge) =>
                  trackedChallenge.challenge.id === challengeData.challenge.id
              ) !== undefined && <span>Tu suis ce challenge</span>}
          </div>

          <div className="rules">
            <h3>Règles</h3>
            <hr />
            <p>{challengeData.challenge.rules}</p>
          </div>
        </article>

        {msg !== null && (
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
        )}

        {user &&
          userBacklog.find(
            (game) => game.gameId === challengeData.challenge.game_id
          ) !== undefined &&
          userTrackedChallenges.find(
            (trackedChallenge) =>
              trackedChallenge.challenge.id === challengeData.challenge.id
          ) === undefined && (
            <div className="add">
              <form
                className="add-to-tracked-challenges"
                onSubmit={handleAddToTracked}
              >
                <button className="btn btn-add">
                  Ajouter à mes challenges en cours
                </button>
              </form>
            </div>
          )}

        {user &&
          userBacklog.find(
            (game) => game.gameId === challengeData.challenge.game_id
          ) === undefined && (
            <div className="add">
              <form className="add-to-backlog" onSubmit={handleAddToBacklog}>
                <button className="btn btn-add">
                  Ajouter le jeu à mon backlog
                </button>
              </form>
            </div>
          )}

        {userRoles?.includes("ROLE_ADMIN") &&
          challengeData.challenge.status === "pending" && (
            <div className="moderation">
              <button className="btn btn-valid" onClick={validatePublication}>
                Autoriser la publication
              </button>
              <button className="btn btn-refuse" onClick={refusePublication}>
                Refuser la publication
              </button>
              <button className="btn btn-edit" onClick={editPublication}>
                {isEditing ? "Fermer le formulaire" : "Modifier"}
              </button>
            </div>
          )}

        {userRoles?.includes("ROLE_ADMIN") && isEditing && (
          <EditChallengeForm
            challengeId={challengeData.challenge.id}
            challengeName={challengeData.challenge.name}
            challengeRules={challengeData.challenge.rules}
          />
        )}
      </section>
    )
  } else if (isError) {
    content = (
      <div className="messagefield">
        <small className="message err-message">{JSON.stringify(error)}</small>
      </div>
    )
  }

  return content
}

export default Challenge
