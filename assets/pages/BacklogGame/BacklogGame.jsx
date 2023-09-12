import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

import { useSelector } from "react-redux"
import { selectBacklogGameByGameId } from "../../features/userBacklog/userBacklogSlice"
import { useGetGameInfosQuery } from "../../features/userBacklog/userBacklogApiSlice"

import CreateChallengeForm from "../../components/CreateChallengeForm/CreateChallengeForm"
import {
  selectUserCreatedChallengesByGame,
  selectUserTrackedChallengesByGame,
} from "../../features/challenges/challengesSlice"

import TrackedChallengeCard from "../../components/TrackedChallengeCard/TrackedChallengeCard"
import CreatorChallengeCard from "../../components/CreatorChallengeCard/CreatorChallengeCard"

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

import "./BacklogGame.css"
import { useTitle } from "../../hooks/useTitle"

const BacklogGame = () => {
  const { gameId } = useParams()
  const game = useSelector((state) =>
    selectBacklogGameByGameId(state, Number(gameId))
  )
  const userCreatedChallengesForGame = useSelector((state) =>
    selectUserCreatedChallengesByGame(state, Number(gameId))
  )
  const userTrackedChallengesForGame = useSelector((state) =>
    selectUserTrackedChallengesByGame(state, Number(gameId))
  )

  if (!game) {
    return (
      <section>
        <h2>Jeu non trouvé!</h2>
      </section>
    )
  }

  useTitle(game.gameName)

  const {
    data: gameInfos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGameInfosQuery(gameId)

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
      <section className="container backlog-game">
        <div
          className="game-title"
          style={{ backgroundImage: `url(${gameInfos.imgUrl})` }}
        >
          <div className="game-title-wrapper">
            <h1>{game.gameName}</h1>
          </div>
        </div>

        <article className="tracked-challenges">
          <div className="subtitle">
            <h2>Mes challenges suivis</h2>
            <hr />
          </div>
          <ul className="tracked-challenges-list">
            {userTrackedChallengesForGame.map((trackedChallenge) => {
              return <TrackedChallengeCard key={trackedChallenge.id} trackedChallenge={trackedChallenge} />
            })}
          </ul>
        </article>

        <article className="creator-challenges">
          <div className="subtitle">
            <h2>Mes challenges créés</h2>
            <hr />
          </div>
          <ul className="creator-challenges-list">
            {userCreatedChallengesForGame.map((creatorChallenge) => {
              return <CreatorChallengeCard key={creatorChallenge.id} creatorChallenge={creatorChallenge} />
            })}
          </ul>
        </article>

        <CreateChallengeForm gameId={gameId} />
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

export default BacklogGame
