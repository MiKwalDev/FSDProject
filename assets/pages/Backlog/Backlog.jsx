import React from "react"
import { useTitle } from "../../hooks/useTitle"

import { useSelector } from "react-redux"
import { selectCurrentBacklogGames } from "../../features/userBacklog/userBacklogSlice"

import BacklogGameCard from "../../components/BacklogGameCard/BacklogGameCard"
import formatDate from "../../utils/formatDate/formatDate"

import "./Backlog.css"

const Backlog = () => {
  useTitle("Backlog")

  const userGames = useSelector(selectCurrentBacklogGames)

  const content = (
    <section className="container backlog">
      <h1>Backlog</h1>

      <article className="backlog-management">
        <div className="title">
          <h2>Mes jeux</h2>
          <hr />
        </div>

        <div className="games-list">
          {userGames.map((game) => {
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
        </div>
      </article>
    </section>
  )

  return content
}

export default Backlog
