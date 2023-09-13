import React from "react"

import './ChallengeCard.css'

const ChallengeCard = ({ name, creator, gameName, rules, imgUrl }) => {
  const content = (
    <div className="challenge-card" style={{ backgroundImage: `url(${imgUrl})` }}>
      <div className="challenge-card-infos">
        <div className="challenge-infos">
          <h3>{name}</h3>
          <span>Créé par {creator}</span>
        </div>
        <div className="game-infos">
          <p>Jeu</p>
          <span>{gameName}</span>
        </div>
      </div>
      <div className="challenge-rules">
        <span>Règles:</span>
        <span className="rules-exerpt">{rules}</span>
      </div>
    </div>
  )
  return content
}

export default ChallengeCard
