import React from 'react'
import { Link, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import { useSelector } from "react-redux"
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'


const PersistLogin = () => {
  const token = useSelector(selectCurrentToken)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, {
    isUninitialized,
    isLoading,
    isSuccess,
    isError,
    error
  }] = useRefreshMutation()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('verifying refresh token')
      try {
        await refresh()
        setTrueSuccess(true)
      } catch (err) {
        console.log(err)
      }
    }

    if (!token) verifyRefreshToken()
  }, [])

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isError) {
    content = (
      <p className='errmsg'>
        {error.data?.message}
        <Link to="/login">Please login again</Link>.
      </p>
    )
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />
  } else if (token && isUninitialized) {
    content = <Outlet />
  }

  return content
}

export default PersistLogin