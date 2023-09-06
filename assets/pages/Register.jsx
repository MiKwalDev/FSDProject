import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../features/register/registerApiSlice"

import "../styles/Register.css"

const Register = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errMsg, setErrMsg] = useState([])
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg([])
  }, [username, email, password, passwordConfirm])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const registerData = await register({
      username,
      email,
      password,
      passwordConfirm,
    }).unwrap()

    if (registerData.errors) {
      setErrMsg(registerData.errors)
    } else if (registerData.success) {
      setUsername("")
      setEmail("")
      setPassword("")
      setPasswordConfirm("")
      navigate("/login")
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)

  const handleEmailInput = (e) => setEmail(e.target.value)

  const handlePwdInput = (e) => setPassword(e.target.value)

  const handlePwdConfirmInput = (e) => setPasswordConfirm(e.target.value)

  const hideLabel = (e) => document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section className="container register">
      <div className="title">
        <h1>Inscription</h1>
        <hr />
      </div>

      {errMsg.length > 0 && (
        <div className="messagefield">
          <small
            className="message err-message"
            ref={errRef}
            aria-live="assertive"
          >
            {errMsg[0].message}
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
        <div className="input-group">
          <label htmlFor="password" id="password-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePwdInput}
            onFocus={hideLabel}
            onBlur={hideLabel}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="passwordConfirm" id="passwordConfirm-label">
            Confirmation du mot de passe
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={handlePwdConfirmInput}
            onFocus={hideLabel}
            onBlur={hideLabel}
            required
          />
        </div>
        <div className="validation">
          <button className="btn submit-btn">S'INSCRIRE</button>
        </div>
      </form>
    </section>
  )

  return (
      content
  )
}

export default Register
