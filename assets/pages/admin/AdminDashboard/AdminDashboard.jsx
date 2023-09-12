import React, { useEffect } from "react"
import { useTitle } from "../../../hooks/useTitle"

import { Link, useNavigate } from "react-router-dom"

import { useGetAdminDataQuery } from "../../../features/admin/adminApiSlice"

import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import AdminSideBar from "../../../components/AdminSideBar/AdminSideBar"

import "./AdminDashboard.css"

const AdminDashboard = () => {
  useTitle("Tableau d'administration")
  const navigate = useNavigate()

  const {
    data: adminData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdminDataQuery()

  useEffect(() => {
    error?.originalStatus === 403 &&
      navigate("/dashboard?errmsg=accès non autorisé")
  }, [error])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
      <>
        <AdminSideBar />
        <section className="admin">
          <h1>Administration</h1>

          <article className="challenge-moderation">
            <div className="title">
              <h2>Challenges en attente de validation</h2>
              <hr />
            </div>

            <ul className="challenges-list">
              {adminData?.onPendingChallenges.map((challenge) => {
                return (
                  <li className="challenge-list-item" key={challenge.id}>
                    {challenge.name}
                    <Link
                      className="see-more"
                      to={`/challenge/${challenge.id}`}
                    >
                      Détails <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </article>
        </section>
      </>
    )
  } else if (isError && error.originalStatus === 403) {
    content = <h1>Non autorisé</h1>
  }

  return content
}

export default AdminDashboard
