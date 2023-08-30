import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { useGetCurrentUserDataQuery } from "../features/users/usersApiSlice"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { selectCurrentUser } from "../features/auth/authSlice"

import Header from "../components/Header"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBox from "../components/SearchBox"
import BacklogGameCard from "../components/BacklogGameCard"

import "../styles/Dashboard.css"

const Dashboard = () => {
  const user = useSelector(selectCurrentUser)

  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCurrentUserDataQuery()

  const formatDate = (date) => {
    let dateObj = new Date(date)
    return dateObj.toLocaleDateString("fr", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  useEffect(() => {
    document.title = "Tableau de bord"
  }, [])

  /* useEffect(() => {
    console.log("userData: ", userData)
    userData && console.log("userGames: ", userData.userGames)
  }, [userData]) */

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
            <button className="btn"> {/* /dashboard/edit-profil */}
              Modifier
            </button>
          </div>
        </article>

        <article className="challenges">
          <div className="title">
            <h2>Mes challenges</h2>
            <hr />
          </div>
        </article>

        <article className="backlog">
          <div className="title">
            <h2>Mon backlog</h2>
            <hr />
          </div>

          <SearchBox />

          <div className="user-backlog">
            {userData.userGames.map((game) => {
              return (
                <Link key={game.id} to={`backlog/game/${game.id}`} className="wrapper-link" >
                  <BacklogGameCard
                    name={game.gameName}
                    imgurl={game.gameCoverUrl}
                    addedat={formatDate(game.addedAt)}
                  />
                </Link>
              )
            })}
          </div>
        </article>
      </section>
    )
  } else if (isError) {
    content = <h1>{JSON.stringify(error)}</h1>
  }

  return (
    <>
      <Header />
      {content}
    </>
  )
}

export default Dashboard
