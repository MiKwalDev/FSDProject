import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { logOut, selectCurrentUser } from "../features/auth/authSlice"
import { useLogoutMutation } from "../features/auth/authApiSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import "../styles/Header.css"

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false)

  const user = useSelector(selectCurrentUser)

  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()

  const pageLinks = user
    ? [
        {
          name: "Accueil",
          url: "/",
        },
      ]
    : [
        {
          name: "Accueil",
          url: "/",
        },
        {
          name: "Connexion",
          url: "/login",
        },
        {
          name: "S'inscrire",
          url: "/register",
        },
      ]

  const handleLogOut = async (e) => {
    e.preventDefault()

    try {
      await logout().unwrap()
    } catch(err) {
      console.log(err)
    }
    setMobileMenuOpen(false)
    dispatch(logOut())
  }

  const toggleDropdown = () =>
    dropdownMenuOpen ? setDropdownMenuOpen(false) : setDropdownMenuOpen(true)

  useEffect(() => {
    pageLinks.map((page) => {
      if (page.url == location.pathname) {
        document.title = page.name
      }
    })
  }, [])

  return (
    <header className="header">
      <button
        className="navbar-toggle"
        onClick={() =>
          mobileMenuOpen ? setMobileMenuOpen(false) : setMobileMenuOpen(true)
        }
      >
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
      <nav className={mobileMenuOpen ? "navbar navbar-show" : "navbar"}>
        <ul className="navbar-list">
          {user && (
            <>
              <button
                className="navbar-list-element dropdown-toggle"
                onClick={toggleDropdown}
              >
                {user}{"  "}
                {dropdownMenuOpen ? (
                  <FontAwesomeIcon icon={faChevronDown} size="xs"/>
                ) : (
                  <FontAwesomeIcon icon={faChevronRight} size="xs"/>
                )}
              </button>
              <li
                className={
                  dropdownMenuOpen
                    ? "navbar-list-element dropdown dropdown-show"
                    : "navbar-list-element dropdown"
                }
              >
                <Link className={"nav-link"} to={"/dashboard"}>
                  Tableau de bord
                </Link>
              </li>
            </>
          )}
          {pageLinks.map((page, key) => {
            return (
              <li key={key} className="navbar-list-element">
                <Link className="nav-link" to={page.url}>
                  {page.name}
                </Link>
              </li>
            )
          })}
          {user && (
            <li
              onClick={handleLogOut}
              id="logout-btn"
              className="navbar-list-element"
            >
              <Link className="nav-link" to={"/"}>
                Se deconnecter
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
