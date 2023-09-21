import React, { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTitle } from "../../hooks/useTitle"

import { useSelector } from "react-redux"
import {
  selectCurrentUser,
  selectCurrentUserCreatedAt,
  selectCurrentUserEmail,
  selectCurrentUserId,
} from "../../features/auth/authSlice"
import { selectCurrentBacklogGames } from "../../features/userBacklog/userBacklogSlice"
import { selectUserActivesTrackedChallenges } from "../../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import formatDate from "../../utils/formatDate/formatDate"
import GamesSearchBox from "../../components/GamesSearchBox/GamesSearchBox"
import TrackedChallengeCard from "../../components/TrackedChallengeCard/TrackedChallengeCard"
import BacklogGameCard from "../../components/BacklogGameCard/BacklogGameCard"
import EditProfilForm from "../../components/EditProfilForm/EditProfilForm"

import "./Dashboard.css"

const Dashboard = () => {
  useTitle("Tableau de bord")

  const user = useSelector(selectCurrentUser)
  const userId = useSelector(selectCurrentUserId)
  const userEmail = useSelector(selectCurrentUserEmail)
  const userCreatedAt = useSelector(selectCurrentUserCreatedAt)
  const backlogGames = useSelector(selectCurrentBacklogGames)
  const [showEditForm, setShowEditForm] = useState(false)

  const [queryParameters] = useSearchParams()
  const errRef = useRef()
  const [errMsg, setErrMsg] = useState(null)

  const userActivesTrackedChallenges = useSelector((state) =>
    selectUserActivesTrackedChallenges(state, false)
  )

  useEffect(() => {
    queryParameters?.get("errmsg") && setErrMsg(queryParameters?.get("errmsg"))

    setTimeout(() => {
      setErrMsg(null)
    }, 5000)
  }, [queryParameters])

  useEffect(() => {
    errMsg !== null && errRef.current.focus()
  }, [errMsg])

  const handleOnClickEdit = (e) => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
  }

  const content = (
    <section className="container dashboard">
      <h1>Tableau de bord</h1>

      {errMsg && (
        <div className="messagefield">
          <small
            className="message err-message"
            ref={errRef}
            aria-live="assertive"
          >
            {errMsg}
          </small>
        </div>
      )}

      <article className="profil">
        <div className="title">
          <h2>Mon profil</h2>
          <hr />
        </div>

        <div className="profil-card">
          <h3>{user}</h3>
          <span>Email: {userEmail}</span>
          <span>Inscrit depuis le: {formatDate(userCreatedAt)}</span>
          {/* <button className="btn" onClick={handleOnClickEdit}>
            {showEditForm ?
              "Annuler"
              : "Modifier"}
          </button>

          {showEditForm ?
            <EditProfilForm currentUsername={user} currentEmail={userEmail} />
            : ""} */}
        </div>
      </article>

      <article className="tracked-challenges">
        <div className="title">
          <h2>Mes challenges en cours</h2>
          <hr />
        </div>
        <ul className="tracked-challenges-list">
          {userActivesTrackedChallenges?.map((challenge, index) => {
            if (index >= 5) return
            return (
              <TrackedChallengeCard
                key={challenge.id}
                trackedChallenge={challenge}
              />
            )
          })}
          <Link className="see-more" to={`/dashboard/challenges/${userId}`}>
            Voir plus <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </ul>
      </article>

      <article className="backlog">
        <div className="title">
          <h2>Mon backlog</h2>
          <hr />
        </div>

        <GamesSearchBox />

        <div className="user-backlog">
          {backlogGames.map((game, index) => {
            if (index >= 6) return
            return (
              <BacklogGameCard
                key={game.id}
                backlogGameId={game.id}
                name={game.gameName}
                imgurl={game.gameCoverUrl}
                addedat={formatDate(game.addedAt.date)}
                linkTo={`/dashboard/backlog/game/${game.gameId}`}
              />
            )
          })}
          <Link className="see-more" to={`/dashboard/backlog/${userId}`}>
            Voir plus <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </article>
    </section>
  )

  return content
}

export default Dashboard
