import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { useLazySearchChallengesQuery } from "../../features/challenges/challengesApiSlice"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"

import "./HeaderSearchBox.css"

const HeaderSearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchResultOpen, setSearchResultOpen] = useState(false)

  const [triggerSearchChallenges, { data: challenges, isFetching }] =
    useLazySearchChallengesQuery(searchQuery)

  const handleSearchChange = (e) => {
    setSearchResultOpen(false)
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setSearchTimeout(
      setTimeout(() => {
        if (searchQuery.length > 2 && !isFetching) {
          triggerSearchChallenges(searchQuery)
          setSearchResultOpen(true)
        }
      }, 2000)
    )

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  useEffect(() => {
    challenges && console.log(challenges)
  }, [challenges])

  let searchResult
  if (isFetching) {
    searchResult = <LoadingSpinner />
  } else if (challenges?.error && !isFetching) {
    searchResult = (
      <div className="search-result-challenge">
        <small className="message err-message">{challenges?.error}</small>
      </div>
    )
  } else if (challenges?.challenges && !isFetching) {
    searchResult = challenges?.challenges?.map((challenge) => {
      return (
        <Link
          key={challenge.challengeId}
          className="search-result-challenge"
          to={`/challenge/${challenge.challengeId}`}
          onClick={() => {
            setSearchResultOpen(false)
            setSearchQuery("")
          }}
        >
          <span>{challenge.challengeName}</span>
          <span>Jeu: {challenge.challengeGame}</span>
          <FontAwesomeIcon icon={faArrowRight} className="arrow" />
        </Link>
      )
    })
  }

  return (
    <div className="search">
      <form className="search-form">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher challenge"
          name="search"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon
          icon={faXmark}
          className="cross"
          onClick={() => {
            setSearchResultOpen(false)
            setSearchQuery("")
          }}
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <ul className={searchResultOpen ? "search-result" : "hidden"}>
        {searchResult}
      </ul>
    </div>
  )
}

export default HeaderSearchBox
