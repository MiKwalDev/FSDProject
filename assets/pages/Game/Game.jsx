import React, { useEffect } from 'react'
import { useGetGameDataQuery } from '../../features/igdb/gamesApiSlice'
import { useParams } from 'react-router-dom'

import ChallengeCard from '../../components/ChallengeCard/ChallengeCard'

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

import "./Game.css"
import { useTitle } from '../../hooks/useTitle'

const Game = () => {
  const { gameId } = useParams()

  const {
    data: gameData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGameDataQuery(gameId)

  useTitle(gameData?.gameName)

  /* useEffect(() => {
    gameData && console.log(gameData)
  }, [gameData]) */

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
      <section className="container game">
        <div className="game-title" style={{ backgroundImage: `url(${gameData.imgUrl})` }}>
          <div className="game-title-wrapper">
            <h1>{gameData.gameName}</h1>
          </div>
        </div>

        <article className="search-challenges">

        </article>

        <article className="last-challenges">
          <div className="title">
            <h2>Derniers challenges créés</h2>
            <hr />
          </div>

          <ul className="last-challenges-list">
            {gameData.lastChallengesCreated.map((challenge) => {
              return (
                <ChallengeCard
                  key={challenge.id}
                  challengeId={challenge.id}
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

export default Game