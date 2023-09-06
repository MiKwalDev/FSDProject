import React, { useEffect, useRef, useState } from "react"

import { useAddGameToBacklogMutation } from "../features/userBacklog/userBacklogApiSlice"

import NoVisualCover from "../styles/images/no_visual.png"

const SearchGameCard = ({ gameId, name, imgurl, imgurl2x }) => {
  const msgRef = useRef()
  const [msg, setMsg] = useState([])
  const [addGame, { isLoading }] = useAddGameToBacklogMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const addGameResult = await addGame({
      gameId: gameId,
      gameName: name,
      gameCover: imgurl2x,
    }).unwrap()
    setMsg(addGameResult)

    setTimeout(() => {
      setMsg([])
    }, 5000)
  }

  useEffect(() => {
    msg.length !== 0 && msgRef.current.focus()
  }, [msg])

  return (
    <li className="game-card">
      <img src={imgurl !== "noCover" ? imgurl : NoVisualCover} alt="cover" />
      <div className="game-card-info">
        <h4>{name}</h4>
        {msg.length !== 0 ? (
          <div className="search-result messagefield">
            <small
              className={
                msg.success ? "message success-message" : "message err-message"
              }
              ref={msgRef}
              aria-live="assertive"
            >
              {msg.success || msg.error}
            </small>
          </div>
        ) : (
          <form className="add-to-backlog" onSubmit={handleSubmit}>
            <button className="btn">Ajouter à mon blacklog</button>
          </form>
        )}
      </div>
    </li>
  )
}

export default SearchGameCard
