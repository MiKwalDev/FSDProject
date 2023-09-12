import React from "react"

import { useSelector } from "react-redux/es/hooks/useSelector"
import { selectCurrentUser } from "../../features/auth/authSlice"

import './Home.css'

const Home = () => {
  const user = useSelector(selectCurrentUser)

  let content
  content = (
    <section className="container home">
      {user ?
        <h1>Salut {user} !</h1>
        :
        <h1>Welcome in a world where YOU make the rules !</h1>}
    </section>
  )

  return (
      content
  )
}

export default Home