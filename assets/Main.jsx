import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import BacklogGame from "./pages/BacklogGame"
import Challenge from "./pages/Challenge"

import RequireAuth from "./features/auth/RequireAuth"
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

            <Route path="challenge/:challengeId" element={<Challenge />} />

            <Route element={<RequireAuth />}>
              <Route path="dashboard" >
                <Route index element={<Dashboard />} />
                <Route path="backlog/game/:gameId" element={<BacklogGame />} />
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
