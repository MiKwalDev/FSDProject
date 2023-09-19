import React, { useEffect, useRef, useState } from "react"
import { useModifyProfilMutation } from "../../features/users/usersApiSlice"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

import "./EditProfilForm.css"

const EditProfilForm = ({ currentUsername, currentEmail }) => {
  const userRef = useRef()
  const msgRef = useRef()
  const [username, setUsername] = useState(currentUsername)
  const [email, setEmail] = useState(currentEmail)
  const [msg, setMsg] = useState(null)

  const [modifyProfil, { isLoading }] = useModifyProfilMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setMsg(null)
  }, [username, email])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const modifyResult = await modifyProfil({
      username,
      email,
    }).unwrap()
    
    if (modifyResult.error) {
      setMsg(modifyResult)
    } else if (modifyResult.success) {
      setUsername("")
      setEmail("")
      setMsg(modifyResult)
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)

  const handleEmailInput = (e) => setEmail(e.target.value)

  const hideLabel = (e) => document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else {
    content = (
      <article className="edit-form">
        {msg !== null && (
          <div className="messagefield">
            <small
              className={
                msg.error
                  ? "message err-message"
                  : "message success-message"
              }
              ref={msgRef}
              aria-live="assertive"
            >
              {msg.error || msg.success}
            </small>
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="username" id="username-label">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              onFocus={hideLabel}
              onBlur={hideLabel}
              autoComplete="false"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" id="email-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailInput}
              onFocus={hideLabel}
              onBlur={hideLabel}
              required
            />
          </div>
          <div className="validation">
            <button className="btn submit-btn">Modifier</button>
          </div>
        </form>
      </article>
    )
  }

  return content
}

export default EditProfilForm
