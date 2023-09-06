import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { useGetCurrentUserDataQuery } from "../features/users/usersApiSlice"

import { useDispatch, useSelector } from "react-redux"
import { setUserId } from "../features/auth/authSlice"
import { setGames } from "../features/userBacklog/userBacklogSlice"
import {
  selectUserActivesTrackedChallenges,
  setUserCreatedChallenges,
  setUserTrackedChallenges,
} from "../features/challenges/challengesSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBox from "../components/SearchBox"
import TrackedChallengeCard from "../components/TrackedChallengeCard"
import BacklogGameCard from "../components/BacklogGameCard"

import "../styles/Dashboard.css"
import { useTitle } from "../hooks/useTitle"

const Dashboard = () => {
  useTitle("Tableau de bord")
  
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

  const formatDate = (date) => {
    let dateObj = new Date(date)
    return dateObj.toLocaleDateString("fr", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  useEffect(() => {
    // console.log(userData)
    if (userData) {
      dispatch(setUserId(userData.id))
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

        <article className="profil">
          <div className="title">
            <h2>Mon profil</h2>
            <hr />
          </div>

          <div className="profil-card">
            <h3>{userData.username}</h3>
            <span>Email: {userData.userIdentifier}</span>
            <span>Inscrit depuis le: {formatDate(userData.createdAt)}</span>
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
                <TrackedChallengeCard key={challenge.id} trackedChallenge={challenge} />
              )
            })}
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
                <Link
                  key={game.id}
                  to={`/dashboard/backlog/game/${game.gameId}`}
                  className="wrapper-link"
                >
                  <BacklogGameCard
                    name={game.gameName}
                    imgurl={game.gameCoverUrl}
                    addedat={formatDate(game.addedAt)}
                  />
                </Link>
              )
            })}
            <Link to={`/dashboard/backlog`}>
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
