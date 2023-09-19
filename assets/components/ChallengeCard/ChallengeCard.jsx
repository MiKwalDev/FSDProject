import React from "react"
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

import "./ChallengeCard.css"

const ChallengeCard = ({ challengeId, name, creator, gameName, rules, imgUrl, size = "small" }) => {
  const content = (
    <div
      className={size === "small" ? "challenge-card" : "challenge-card challenge-card-big"}
      style={{ backgroundImage: `url(${imgUrl})` }}
    >
      <Link className="see-rules" to={`/challenge/${challengeId}`}>
        Voir les règles <FontAwesomeIcon icon={faArrowRight} />
      </Link>
      <div className={size === "small" ? "challenge-card-infos" : "challenge-card-infos challenge-card-infos-big"}>
        <div className="challenge-infos">
          <h3>{name}</h3>
          <span>Créé par {creator}</span>
        </div>
        <div className="game-infos">
          <p>Jeu</p>
          <span>{gameName}</span>
        </div>
      </div>
      <div className={size === "small" ? "challenge-rules" : "challenge-rules challenge-rules-big"}>
        <span>Règles:</span>
        <span className="rules-exerpt">{rules}</span>
      </div>
    </div>
  )
  return content
}

export default ChallengeCard
