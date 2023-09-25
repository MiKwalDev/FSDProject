import React, { useEffect, useRef, useState } from "react"

import { selectCurrentUserId } from "../../features/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useAddGameToBacklogMutation } from "../../features/userBacklog/userBacklogApiSlice"
import { addGameToBacklog } from "../../features/userBacklog/userBacklogSlice"

import NoVisualCover from "../../styles/images/no_visual.png"

import "./SearchGameCard.css"

const SearchGameCard = ({ gameId, name, imgurl, imgurl2x }) => {
  const currentUserId = useSelector(selectCurrentUserId)
  const msgRef = useRef()
  const [msg, setMsg] = useState(null)

  const dispatch = useDispatch()
  const [addGame, { isLoading }] = useAddGameToBacklogMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const addGameResult = await addGame({
      gameId: gameId,
      gameName: name,
      gameCover: imgurl2x,
    }).unwrap()

    if (addGameResult.error) {
      setMsg(addGameResult.error)

      setTimeout(() => {
        setMsg(null)
      }, 5000)
    } else if (addGameResult.success) {
      dispatch(addGameToBacklog({
        id: addGameResult.userGameId,
        gameId: gameId,
        gameName: name,
        gameCoverUrl: imgurl2x,
        user: currentUserId,
        addedAt: addGameResult.addedAt
      }))
    }

    setMsg(addGameResult)

    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  useEffect(() => {
    msg !== null && msgRef.current.focus()
  }, [msg])

  return (
    <li className="search-game-card">
      <img src={imgurl !== "noCover" ? imgurl : NoVisualCover} alt="cover" />
      <div className="search-game-card-info">
        <h4>{name}</h4>
        {msg !== null ? (
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
