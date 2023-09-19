import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import BacklogGame from "./pages/BacklogGame/BacklogGame"
import Game from "./pages/Game/Game"
import Challenge from "./pages/Challenge/Challenge"
import Backlog from "./pages/Backlog/Backlog"
import AllUserChallenges from "./pages/AllUserChallenges/AllUserChallenges"

import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers/AdminUsers"

import RequireAuth from "./features/auth/RequireAuth"
import PersistLogin from "./features/auth/PersistLogin"
import { store } from "./app/store"
import { Provider } from "react-redux"

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="game/:gameId" element={<Game />} />
          <Route path="challenge/:challengeId" element={<Challenge />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="dashboard">
                <Route index element={<Dashboard />} />
                <Route path="backlog/game/:gameId" element={<BacklogGame />} />
                <Route path="backlog/:userId" element={<Backlog />} />
                <Route
                  path="challenges/:userId"
                  element={<AllUserChallenges />}
                />
              </Route>

              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default Main

if (document.getElementById("app")) {
  const rootElement = document.getElementById("app")
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <Main />
      </Provider>
    </StrictMode>
  )
}
