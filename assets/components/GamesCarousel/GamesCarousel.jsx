import React, { useEffect } from "react"

import Glide from "@glidejs/glide"
import "@glidejs/glide/src/assets/sass/glide.core.scss"
import "@glidejs/glide/src/assets/sass/glide.theme.scss"
import "./GamesCarousel.css"

import GameCard from "../GameCard/GameCard"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons"

const sliderConfiguration = {
  gap: 20,
  perView: 4,
  startAt: 0,
  type: "slider",
}

const GamesCarousel = ({ games }) => {
  const slider = new Glide(".glide", sliderConfiguration)

  useEffect(() => {
    slider.mount()
  }, [slider, games])

  const content = (
    <div className="glide">
      <div className="glide__arrows" data-glide-el="controls">
        <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
          <FontAwesomeIcon icon={faChevronCircleLeft} />
        </button>
      </div>
      <div className="glide__track" data-glide-el="track">
        <ul className="glide__slides">
          {games.map((game) => {
            return (
              <GameCard
                key={game.gameId}
                name={game.gameName}
                imgurl={game.imgurl}
                challengeCount={game.challengeCount}
                linkTo={`/game/${game.gameId}`}
              />
            )
          })}
        </ul>
      </div>
      <div className="glide__arrows" data-glide-el="controls">
        <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
          <FontAwesomeIcon icon={faChevronCircleRight} />
        </button>
      </div>
    </div>
  )

  return content
}

export default GamesCarousel
