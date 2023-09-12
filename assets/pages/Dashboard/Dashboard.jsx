import React, { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTitle } from "../../hooks/useTitle"

import { useGetCurrentUserDataQuery } from "../../features/users/usersApiSlice"

import { useDispatch, useSelector } from "react-redux"
import { setUserId, setUserRoles } from "../../features/auth/authSlice"
import { setGames } from "../../features/userBacklog/userBacklogSlice"
import {
  selectUserActivesTrackedChallenges,
  setUserCreatedChallenges,
  setUserTrackedChallenges,
} from "../../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import formatDate from "../../utils/formatDate/formatDate"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import SearchBox from "../../components/SearchBox/SearchBox"
import TrackedChallengeCard from "../../components/TrackedChallengeCard/TrackedChallengeCard"
import BacklogGameCard from "../../components/BacklogGameCard/BacklogGameCard"

import "./Dashboard.css"

const Dashboard = () => {
  useTitle("Tableau de bord")

  const [queryParameters] = useSearchParams()
  const errRef = useRef()
  const [errMsg, setErrMsg] = useState(null)

  const dispatch = useDispatch()
  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCurrentUserDataQuery()

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

  useEffect(() => {
    if (userData) {
      // console.log(userData.roles)
      dispatch(setUserId(userData.id))
      dispatch(setUserRoles(userData.roles))
      dispatch(setGames(userData.userGames))
      dispatch(setUserCreatedChallenges(userData.createdChallenges))
      dispatch(setUserTrackedChallenges(userData.trackedChallenges))
    }
  }, [userData])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
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
            <h3>{userData.username}</h3>
            <span>Email: {userData.userIdentifier}</span>
            <span>
              Inscrit depuis le: {formatDate(userData.createdAt)}
            </span>
            <button className="btn">
              {" "}
              {/* /dashboard/edit-profil */}
              Modifier
            </button>
          </div>
        </article>

        <article className="tracked-challenges">
          <div className="title">
            <h2>Mes challenges en cours</h2>
            <hr />
          </div>
          <ul className="tracked-challenges-list">
            {userActivesTrackedChallenges.map((challenge, index) => {
              if (index >= 5) return
              return (
                <TrackedChallengeCard
                  key={challenge.id}
                  trackedChallenge={challenge}
                />
              )
            })}
            <Link
              className="see-more"
              to={`/dashboard/challenges/${userData.id}`}
            >
              Voir plus <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </ul>
        </article>

        <article className="backlog">
          <div className="title">
            <h2>Mon backlog</h2>
            <hr />
          </div>

          <SearchBox />

          <div className="user-backlog">
            {userData.userGames.map((game, index) => {
              if (index >= 6) return
              return (
                <BacklogGameCard
                  key={game.id}
                  backlogGameId={game.id}
                  name={game.gameName}
                  imgurl={game.gameCoverUrl}
                  addedat={formatDate(game.addedAt)}
                  linkTo={`/dashboard/backlog/game/${game.gameId}`}
                />
              )
            })}
            <Link className="see-more" to={`/dashboard/backlog/${userData.id}`}>
              Voir plus <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </article>
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

export default Dashboard
