import React, { useEffect, useRef, useState } from "react"

import { useTitle } from "../../hooks/useTitle"
import { useParams } from "react-router-dom"

import { useSelector } from "react-redux"
import {
  useGetChallengeDataQuery,
  useSetChallengeStatusMutation,
} from "../../features/challenges/challengesApiSlice"
import { selectCurrentUserRoles } from "../../features/auth/authSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"

import formatDate from "../../utils/formatDate/formatDate"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

import "./Challenge.css"

const Challenge = () => {
  const { challengeId } = useParams()
  const userRoles = useSelector(selectCurrentUserRoles)
  const msgRef = useRef()
  const [msg, setMsg] = useState(null)

  const [setChallengeStatus] = useSetChallengeStatusMutation()

  const {
    data: challengeData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetChallengeDataQuery(challengeId)

  useTitle(`${challengeData?.gameName}: ${challengeData?.challenge?.name}`)

  const validatePublication = async (e) => {
    e.preventDefault()

    const validateResult = await setChallengeStatus({
      challengeId: Number(challengeId),
      status: "public"
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
      status: "private"
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

  useEffect(() => {
    msg !== null && msgRef.current.focus()
  }, [msg])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess && challengeData == "Page inaccessible") {
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
          <div className="subtitle">
            <h2>Jeu: {challengeData.gameName}</h2>
            <hr />
          </div>

          <div className="creation-infos">
            <span>
              Créé par {challengeData.challenge.creator.username} le{" "}
              {formatDate(challengeData.challenge.createdAt)}
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

        {userRoles?.includes("ROLE_ADMIN") &&
          challengeData.challenge.status === "pending" && (
            <div className="moderation">
              <button className="btn btn-valid" onClick={validatePublication}>
                Autoriser la publication
              </button>
              <button className="btn btn-refuse" onClick={refusePublication}>
                Refuser la publication
              </button>
            </div>
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
