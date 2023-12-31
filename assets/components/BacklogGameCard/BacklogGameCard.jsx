import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useDispatch } from "react-redux"
import { useRemoveFromBacklogMutation } from "../../features/userBacklog/userBacklogApiSlice"
import { removeGameFromBacklog } from "../../features/userBacklog/userBacklogSlice"

import ConfimDial from "../ConfirmDial/ConfimDial"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

import "./BacklogGameCard.css"

const BacklogGameCard = ({ backlogGameId, name, imgurl, addedat, linkTo }) => {
  const msgRef = useRef()
  const [msg, setMsg] = useState("")
  const [deleteConfirmDial, setDeleteConfirmDial] = useState({
    show: false,
  })
  const [removeFromBacklog, { isLoading }] =
    useRemoveFromBacklogMutation(backlogGameId)

  const dispatch = useDispatch()

  const handleDeleteBtn = (e) => {
    e.preventDefault()

    setDeleteConfirmDial({
      show: true,
    })
  }

  const handleDeleteConfirmValidation = async (e) => {
    e.preventDefault()

    if (deleteConfirmDial.show) {
      setDeleteConfirmDial({
        show: false,
      })

      const removeFromBacklogResult = await removeFromBacklog({
        backlogGameId: Number(backlogGameId),
      }).unwrap()

      if (removeFromBacklogResult.error) {
        setMsg(removeFromBacklogResult.error)

        setTimeout(() => {
          setMsg("")
        }, 5000)
      } else if (removeFromBacklogResult.success) {
        dispatch(removeGameFromBacklog(Number(backlogGameId)))
      }
    }
  }

  const handleDeleteConfirmCancel = (e) => {
    e.preventDefault()

    setDeleteConfirmDial({
      show: false,
    })
  }

  useEffect(() => {
    msg !== "" && msgRef.current.focus()
  }, [msg])

  let content
  if (isLoading) {
    content = (
      <div className="backlog-game-card">
        <LoadingSpinner />
      </div>
    )
  } else {
    content = (
      <div className="backlog-game-card">
        <ConfimDial
          isOpen={deleteConfirmDial.show}
          subject={"suppression"}
          validationFunc={handleDeleteConfirmValidation}
          cancelFunc={handleDeleteConfirmCancel}
        />
        <img src={imgurl !== "noCover" ? imgurl : NoVisualCover} alt="cover" />
        <button className="btn btn-remove" onClick={handleDeleteBtn}>
          Retirer
        </button>
        <Link to={linkTo} className="backlog-game-card-info wrapper-link">
          <h4>{name}</h4>
          <span>Ajouté le: {addedat}</span>
        </Link>
        {msg !== "" && (
          <div className="messagefield">
            <small
              className={"message err-message"}
              ref={msgRef}
              aria-live="assertive"
            >
              {msg}
            </small>
          </div>
        )}
      </div>
    )
  }

  return content
}

export default BacklogGameCard
