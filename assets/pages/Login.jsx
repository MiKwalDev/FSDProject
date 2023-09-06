import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "../features/auth/authSlice"
import { useLoginMutation } from "../features/auth/authApiSlice"

import LoadingSpinner from "../components/LoadingSpinner"

import "../styles/Login.css"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState(null)
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const userData = await login({ username, password }).unwrap()
      dispatch(setCredentials({ ...userData, username }))
      setUsername("")
      setPassword("")
      navigate("/dashboard")
    } catch (err) {
      if (!err?.status) {
        // isLoading: true until timeout occurs
        setErrMsg("Pas de réponse du server")
      } else if (err.status === 400) {
        setErrMsg("Identifiant ou mot de passe manquant")
      } else if (err.status === 401) {
        setErrMsg("Identifiant ou mot de passe invalide")
      } else {
        setErrMsg("Connexion échouée")
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)

  const handlePwdInput = (e) => setPassword(e.target.value)

  const hideLabel = (e) => document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  const content = isLoading ? (
    <LoadingSpinner/>
  ) : (
    <section className="container login">
      <div className="title">
        <h1>Connexion</h1>
        <hr />
      </div>

      {errMsg && (
        <div className="messagefield">
          <small
            className="message err-message"
            ref={errRef}
            aria-live="assertive"
          >
            {errMsg}
          </small>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="username" id="username-label">
            Nom d'utilisateur ou Email
          </label>
          <input
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            onFocus={hideLabel}
            onBlur={hideLabel}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" id="password-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            onChange={handlePwdInput}
            onFocus={hideLabel}
            onBlur={hideLabel}
            value={password}
            required
          />
        </div>

        <div className="validation">
          <button className="btn submit-btn">SE CONNECTER</button>
        </div>
      </form>
    </section>
  )

  return (
      content
  )
}

export default Login
