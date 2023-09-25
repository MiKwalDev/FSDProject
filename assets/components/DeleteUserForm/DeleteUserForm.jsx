import React, { useRef, useState } from "react"

import { useDeleteUserMutation } from "../../features/users/usersApiSlice"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

import './DeleteUserForm.css'

const DeleteUserForm = ({ userId }) => {
  const msgRef = useRef()
  const [msg, setMsg] = useState(null)

  const [deleteUser, { isLoading }] = useDeleteUserMutation()

  const handleDeletion = async (e) => {
    e.preventDefault()

    const result = await deleteUser({
      userId,
    }).unwrap()

    if (result.error) {
      setMsg(result)
    } else if (result.success) {
      setMsg(result)
    }

    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else {
    content = (
      <form className="form" onSubmit={handleDeletion}>
        {msg !== null && (
          <div className="messagefield">
            <small
              className={
                msg.error ? "message err-message" : "message success-message"
              }
              ref={msgRef}
              aria-live="assertive"
            >
              {msg.error || msg.success}
            </small>
          </div>
        )}
        <button className="btn btn-delete">Supprimer</button>
      </form>
    )
  }
  return content
}

export default DeleteUserForm
