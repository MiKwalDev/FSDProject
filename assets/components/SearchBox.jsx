import React, { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

import { useLazySearchGamesByNameQuery } from "../features/igdb/gamesApiSlice"
import {
  searchGames,
  selectUserSearchEntry,
} from "../features/igdb/gamesSlice"
import { useDispatch, useSelector } from "react-redux"

import LoadingSpinner from "./LoadingSpinner"
import SearchGameCard from "./SearchGameCard"

import "../styles/SearchBox.css"

const SearchBox = () => {
  const msgRef = useRef()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFetching, setIsFetching] = useState(false)

  const userEntry = useSelector(selectUserSearchEntry)
  const dispatch = useDispatch()

  const [triggerSearchGamesByName, { data: games, error: gamesError }] =
    useLazySearchGamesByNameQuery({gameName: userEntry})

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(searchGames(searchQuery))
    setSearchQuery("")
    setIsFetching(true)
  }

  const handleSearchChange = (e) => setSearchQuery(e.target.value)

  const emptySearchResult = () => {
    if (searchResult !== "") document.querySelector(".search-result").innerHTML = ""
  }

  let searchResult
  if (games?.length > 0) {
    searchResult = (
      <div className="search-result">
        <ul className="search-result-list">
          {games?.map((game) => {
            return (
              <SearchGameCard
                key={game.gameid}
                gameId={game.gameid}
                name={game.game}
                imgurl={game.imgurl}
              />
            )
          })}
        </ul>
      </div>
    )
  } else if (games?.length === 0) {
    searchResult = (
      <div className="search-result messagefield">
        <small
          className="message err-message"
          ref={msgRef}
          aria-live="assertive"
        >
          "Aucun jeu correspondant"
        </small>
      </div>
    )
  } else {
    searchResult = ""
  }

  useEffect(() => {
    setIsFetching(false)
  }, [games])

  useEffect(() => {
    isFetching && triggerSearchGamesByName({gameName: userEntry})
  }, [isFetching])

  useEffect(() => {
    if (msgRef.current !== undefined && msgRef.current !== null) {
      msgRef.current.focus()
    }
  }, [searchResult])

  return (
    <div className="search">
      <h3>Rechercher un jeu à ajouter</h3>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher"
          name="search"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={emptySearchResult}
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      {isFetching ? <LoadingSpinner /> : searchResult}
    </div>
  )
}

export default SearchBox
