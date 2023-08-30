import React from 'react'

import '../styles/BacklogGameCard.css'

const BacklogGameCard = ({ name, imgurl, addedat }) => {
  return (
    <div className="backlog-game-card">
      <img src={imgurl !== "noCover" ? imgurl : NoVisualCover} alt="cover" />
      <div className="backlog-game-card-info">
        <h4>{name}</h4>
        <span>Ajouté le: {addedat}</span>
      </div>
    </div>
  )
}

export default BacklogGameCard