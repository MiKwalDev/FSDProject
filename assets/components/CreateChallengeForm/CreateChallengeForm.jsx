import React, { useEffect, useRef, useState } from "react"

import { useCreateChallengeMutation } from "../../features/challenges/challengesApiSlice"

import { useDispatch, useSelector } from "react-redux"
import { addNewCreatedChallenge } from "../../features/challenges/challengesSlice"
import { selectCurrentUserId } from "../../features/auth/authSlice"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

const CreateChallengeForm = ({ gameId }) => {
  const msgRef = useRef()
  const [name, setName] = useState("")
  const [rules, setRules] = useState("")
  const [status, setStatus] = useState("private")
  const [msg, setMsg] = useState([])

  const userId = useSelector(selectCurrentUserId)
  const dispatch = useDispatch()

  const [createChallenge, { isLoading }] = useCreateChallengeMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await createChallenge({
      name,
      rules,
      status,
      gameId,
    }).unwrap()

    if (result.errors) {
      setMsg(result.errors)
    } else if (result.success) {
      dispatch(
        addNewCreatedChallenge({
          id: result.challengeId,
          name: name,
          rules: rules,
          status: status === "public" ? "pending" : status,
          creator: userId,
          gameId: Number(gameId),
          createdAt: result.challengeCreatedAt,
        })
      )
      setName("")
      setRules("")
      setStatus("private")
      setMsg(result.success)
    }

    setTimeout(() => {
      setMsg([])
    }, 5000)
  }

  const handleNameInput = (e) => setName(e.target.value)
  const handleRulesInput = (e) => setRules(e.target.value)
  const handleRadioChange = (e) => setStatus(e.target.value)

  const hideLabel = (e) =>
    document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  useEffect(() => {
    msg.length !== 0 && msgRef.current.focus()
  }, [msg])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else {
    content = (
      <article className="create-challenge">
        <div className="subtitle">
          <h2>Créer un challenge</h2>
          <hr />
        </div>

        {msg.length > 0 && (
          <div className="messagefield">
            <small
              className={
                msg[0].message
                  ? "message err-message"
                  : "message success-message"
              }
              ref={msgRef}
              aria-live="assertive"
            >
              {msg[0].message || msg[0]}
            </small>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="name" id="name-label">
              Nom du challenge
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameInput}
              onFocus={hideLabel}
              onBlur={hideLabel}
              autoComplete="false"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="rules" id="rules-label">
              Règles du challenge
            </label>
            <textarea
              id="rules"
              value={rules}
              onChange={handleRulesInput}
              onFocus={hideLabel}
              onBlur={hideLabel}
              required
            >
              {rules}
            </textarea>
          </div>
          <div className="input-group">
            <span>Visibilité</span>
            <div className="radio-group">
              <label htmlFor="private" id="private-label">
                Privé
              </label>
              <input
                type="radio"
                name="status"
                id="private"
                value="private"
                checked={status === "private"}
                onChange={handleRadioChange}
              />
            </div>
            <div className="radio-group">
              <label htmlFor="public" id="public-label">
                Public
              </label>
              <input
                type="radio"
                name="status"
                id="public"
                value="public"
                checked={status === "public"}
                onChange={handleRadioChange}
              />
            </div>
          </div>
          <div className="validation">
            <button className="btn submit-btn">CREER CHALLENGE</button>
          </div>
        </form>
      </article>
    )
  }

  return content
}

export default CreateChallengeForm
