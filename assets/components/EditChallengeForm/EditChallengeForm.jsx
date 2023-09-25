import React, { useEffect, useRef, useState } from "react"

import { useEditChallengeMutation } from "../../features/challenges/challengesApiSlice"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

import './EditChallengeForm.css'

const EditChallengeForm = ({ challengeId, challengeName, challengeRules }) => {
  const msgRef = useRef()
  const [name, setName] = useState(challengeName)
  const [rules, setRules] = useState(challengeRules)
  const [msg, setMsg] = useState(null)

  const [editChallenge, { isLoading }] = useEditChallengeMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await editChallenge({
      challengeId,
      name,
      rules,
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

  const handleNameInput = (e) => setName(e.target.value)
  const handleRulesInput = (e) => setRules(e.target.value)

  const hideLabel = (e) =>
    document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  useEffect(() => {
    msg !== null && msgRef.current.focus()
  }, [msg])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else {
    content = (
      <article className="edit-challenge">
        <div className="title">
          <h2>Modifier le challenge</h2>
          <hr />
        </div>

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
          <div className="validation">
            <button className="btn submit-btn">MODIFIER CHALLENGE</button>
          </div>
        </form>
      </article>
    )
  }

  return content
}

export default EditChallengeForm
