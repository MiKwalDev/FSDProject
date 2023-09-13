import React from "react"
import { Link } from "react-router-dom"

import "./GameCard.css"

const GameCard = ({ name, imgurl, challengeCount, linkTo }) => {
  const content = (
    <div className="game-card">
      <img src={imgurl !== "noCover" ? imgurl : NoVisualCover} alt="cover" />
      <Link to={linkTo} className="game-card-info wrapper-link">
        <h3>{name}</h3>
        <div className="challenge-count">
          <span>Challenges:</span>
          <span>{challengeCount}</span>
        </div>
      </Link>
    </div>
  )

  return content
}

export default GameCard
