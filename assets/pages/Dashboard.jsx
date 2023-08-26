import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { useGetCurrentUserDataQuery } from "../features/users/usersApiSlice"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { selectCurrentUser } from "../features/auth/authSlice"

import Header from "../components/Header"
import LoadingSpinner from "../components/LoadingSpinner"

import '../styles/Dashboard.css'

const Dashboard = () => {
  const user = useSelector(selectCurrentUser)

  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCurrentUserDataQuery()

  /* useEffect(() => {
  console.log(userData)
  }, [userData]) */

  useEffect(() => {
    document.title = "Tableau de bord"
  }, [])
  

  let content
  if (isLoading) {
    content = <LoadingSpinner/>
  } else if (isSuccess) {
    content = (
      <section className="dashboard">
        <h1>Tableau de bord</h1>
        
      </section>
    )
  } else if (isError) {
    content = <h1>{JSON.stringify(error)}</h1>
  }

  return (
    <>
      <Header/>
      { content }
    </>
  )
}

export default Dashboard