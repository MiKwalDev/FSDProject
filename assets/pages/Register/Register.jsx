import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../../features/register/registerApiSlice"

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

import "./Register.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"

const Register = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errMsg, setErrMsg] = useState(null)
  const navigate = useNavigate()

  const [showPwdValidation, setShowPwdValidation] = useState(false)
  const [isPwdValid, setIsPwdValid] = useState(false)
  const regex = new RegExp(/^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/)

  const [showUsernameValidation, setShowUsernameValidation] = useState(false)
  const [isUsernameValid, setIsUsernameValid] = useState(false)
  const uregex = new RegExp(/[^\w\d]+/)

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg(null)
  }, [username, email, password, passwordConfirm])

  useEffect(() => {
    !regex.test(password) ? setIsPwdValid(true) : setIsPwdValid(false)
  }, [password])

  useEffect(() => {
    !uregex.test(username) && username.length > 2 ? setIsUsernameValid(true) : setIsUsernameValid(false)
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const registerData = await register({
      username,
      email,
      password,
      passwordConfirm,
    }).unwrap()

    if (registerData.errors) {
      setErrMsg(registerData.error)
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

  const hideLabel = (e) =>
    document.getElementById(`${e.target.id}-label`).classList.toggle("hidden")

  const content = isLoading ? (
    <LoadingSpinner />
  ) : (
    <section className="container register">
      <div className="title">
        <h1>Inscription</h1>
        <hr />
      </div>

      {errMsg !== null && (
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
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            onFocus={(e) => {
              hideLabel(e)
              setShowUsernameValidation(true)
            }}
            onBlur={(e) => {
              hideLabel(e)
              setShowUsernameValidation(false)
            }}
            autoComplete="false"
            required
          />
        </div>
        <small className={showUsernameValidation ? "user-validation" : "hidden"}>
          {isUsernameValid ? (
            <FontAwesomeIcon icon={faCheck} className="check" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="cross" />
          )} Au moins 3 caractères, pas d'espace ou caractère spécial, _ autorisé
        </small>
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
            onFocus={(e) => {
              hideLabel(e)
              setShowPwdValidation(true)
            }}
            onBlur={(e) => {
              hideLabel(e)
              setShowPwdValidation(false)
            }}
            required
          />
        </div>
        <small className={showPwdValidation ? "pwd-validation" : "hidden"}>
          {isPwdValid ? (
            <FontAwesomeIcon icon={faCheck} className="check" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="cross" />
          )} Au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial
        </small>
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

  return content
}

export default Register
