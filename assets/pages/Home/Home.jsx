import React from "react"

import { useSelector } from "react-redux/es/hooks/useSelector"
import { selectCurrentUser } from "../../features/auth/authSlice"

import { useGetHomeDataQuery } from "../../features/igdb/gamesApiSlice"

import GamesCarousel from "../../components/GamesCarousel/GamesCarousel"
import ChallengeCard from "../../components/ChallengeCard/ChallengeCard"

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

import "./Home.css"

const Home = () => {
  const user = useSelector(selectCurrentUser)

  const {
    data: homeData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetHomeDataQuery()

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
      <section className="container home">
        {user ? (
          <h1>Salut {user} !</h1>
        ) : (
          <h1>Bienvenu dans un monde ou TU dictes les regles !</h1>
        )}

        <article className="popular-games">
          <div className="title">
            <h2>Jeux populaires</h2>
            <hr />
          </div>

          <GamesCarousel games={homeData.popularGames} />
        </article>

        <article className="last-challenges">
          <div className="title">
            <h2>Derniers challenges créés</h2>
            <hr />
          </div>

          <ul className="last-challenges-list">
            {homeData.lastChallengesCreated.map((challenge) => {
              return (
                <ChallengeCard
                  key={challenge.id}
                  name={challenge.name}
                  creator={challenge.creator}
                  gameName={challenge.gameName}
                  rules={challenge.rules}
                  imgUrl={challenge.imgUrl}
                />
              )
            })}
          </ul>
        </article>
      </section>
    )
  }

  return content
}

export default Home
