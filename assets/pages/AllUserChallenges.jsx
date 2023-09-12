import React from "react"
import { useTitle } from "../hooks/useTitle"

import { useSelector } from "react-redux"
import {
  selectUserAbandonedTrackedChallenges,
  selectUserActivesTrackedChallenges,
  selectUserCreatedChallenges,
} from "../features/challenges/challengesSlice"

import TrackedChallengeCard from "../components/TrackedChallengeCard"
import CreatorChallengeCard from "../components/CreatorChallengeCard"

import "../styles/AllUserChallenges.css"

const AllUserChallenges = () => {
  useTitle("Challenges")

  const userActivesTrackedChallenges = useSelector((state) =>
    selectUserActivesTrackedChallenges(state, false)
  )
  const userDoneTrackedChallenges = useSelector((state) =>
    selectUserActivesTrackedChallenges(state, true)
  )
  const userAbandonedTrackedChallenges = useSelector((state) =>
    selectUserAbandonedTrackedChallenges(state, true)
  )
  const userCreatedChallenges = useSelector(selectUserCreatedChallenges)

  const content = (
    <section className="container challenges">
      <h1>Mes Challenges</h1>

      <article className="tracked-challenges">
        <div className="title">
          <h2>Challenges suivis</h2>
          <hr />
        </div>

        <ul className="tracked-challenges-list">
          {userActivesTrackedChallenges.map((challenge) => {
            return (
              <TrackedChallengeCard
                key={challenge.id}
                trackedChallenge={challenge}
              />
            )
          })}
        </ul>
      </article>

      <article className="tracked-challenges">
        <div className="title">
          <h2>Challenges réussis</h2>
          <hr />
        </div>

        <ul className="tracked-challenges-list">
          {userDoneTrackedChallenges.length === 0 ? (
            <li className="no-data">Aucun challenge complété</li>
          ) : (
            userDoneTrackedChallenges.map((challenge) => {
              return (
                <TrackedChallengeCard
                  key={challenge.id}
                  trackedChallenge={challenge}
                />
              )
            })
          )}
        </ul>
      </article>

      <article className="tracked-challenges">
        <div className="title">
          <h2>Challenges abandonnés</h2>
          <hr />
        </div>

        <ul className="tracked-challenges-list">
          {userAbandonedTrackedChallenges.length === 0 ? (
            <li className="no-data">Aucun challenge abandonné</li>
          ) : (
            userAbandonedTrackedChallenges.map((challenge) => {
              return (
                <TrackedChallengeCard
                  key={challenge.id}
                  trackedChallenge={challenge}
                />
              )
            })
          )}
        </ul>
      </article>

      <article className="creator-challenges">
        <div className="title">
          <h2>Challenges créés</h2>
          <hr />
        </div>

        <ul className="creator-challenges-list">
          {userCreatedChallenges.length === 0 ? (
            <li className="no-data">Aucun challenge créé</li>
          ) : (
            userCreatedChallenges.map((challenge) => {
              return (
                <CreatorChallengeCard
                  key={challenge.id}
                  creatorChallenge={challenge}
                />
              )
            })
          )}
        </ul>
      </article>
    </section>
  )

  return content
}

export default AllUserChallenges
