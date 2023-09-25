import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import {
  logOut,
  selectCurrentUser,
  selectCurrentUserRoles,
} from "../../features/auth/authSlice"
import { useLazyLogoutQuery } from "../../features/auth/authApiSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import "./Header.css"
import HeaderSearchBox from "../HeaderSearchBox/HeaderSearchBox"

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false)

  const user = useSelector(selectCurrentUser)
  const userRoles = useSelector(selectCurrentUserRoles)

  const [triggerLogout] = useLazyLogoutQuery()
  const dispatch = useDispatch()

  const pageLinks = user
    ? [
        {
          name: "Accueil",
          url: "/",
        },
        {
          name: "Recherche",
          url: "",
        },
      ]
    : [
        {
          name: "Accueil",
          url: "/",
        },
        {
          name: "Recherche",
          url: "",
        },
        {
          name: "S'inscrire",
          url: "/register",
        },
        {
          name: "Connexion",
          url: "/login",
        },
      ]

  const handleLogOut = (e) => {
    e.preventDefault()

    triggerLogout()

    setMobileMenuOpen(false)
    setDropdownMenuOpen(false)
    dispatch(logOut())
  }

  const toggleDropdown = () =>
    dropdownMenuOpen ? setDropdownMenuOpen(false) : setDropdownMenuOpen(true)

  useEffect(() => {
    pageLinks.map((page) => {
      if (page.url == location.pathname) {
        document.title = `${page.name} | Rule Your Games`
      }
    })
  }, [location])

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
          {pageLinks.map((page, key) => {
            return (
              <li
                key={key}
                className={
                  page.name === "Connexion"
                    ? "navbar-list-element connect-btn"
                    : "navbar-list-element"
                }
              >
                {page.name === "Recherche" ? (
                  <HeaderSearchBox />
                ) : (
                  <Link
                    className={
                      page.name === "S'inscrire"
                        ? "nav-link register-btn"
                        : "nav-link"
                    }
                    to={page.url}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {page.name}{" "}
                    {page.name === "S'inscrire" && (
                      <FontAwesomeIcon icon={faArrowRight} />
                    )}
                  </Link>
                )}
              </li>
            )
          })}
          {user && (
            <>
              <button
                className="navbar-list-element dropdown-toggle connect-btn"
                onClick={toggleDropdown}
              >
                {user}
                {"  "}
                {dropdownMenuOpen ? (
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                ) : (
                  <FontAwesomeIcon icon={faChevronRight} size="xs" />
                )}
              </button>
              <div
                className={
                  dropdownMenuOpen
                    ? "navbar-list-element dropdown dropdown-show"
                    : "navbar-list-element dropdown"
                }
              >
                <li>
                  <Link
                    className={"nav-link"}
                    to={"/dashboard"}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setDropdownMenuOpen(false)
                    }}
                  >
                    Tableau de bord
                  </Link>
                </li>
                {userRoles?.includes("ROLE_ADMIN") && (
                  <li>
                    <Link
                      className={"nav-link"}
                      to={"/admin"}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setDropdownMenuOpen(false)
                      }}
                    >
                      Tableau d'administration
                    </Link>
                  </li>
                )}
                <li
                  onClick={handleLogOut}
                  id="logout-btn"
                  className="navbar-list-element"
                >
                  <Link className="nav-link" to={"/"}>
                    Se deconnecter <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </li>
              </div>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
