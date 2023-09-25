import React from "react"
import { useGetUsersListQuery } from "../../../features/users/usersApiSlice"

import AdminSideBar from "../../../components/AdminSideBar/AdminSideBar"
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner"

import "./AdminUsers.css"
import DeleteUserForm from "../../../components/DeleteUserForm/DeleteUserForm"

const AdminUsers = () => {
  const {
    data: usersList,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersListQuery()

  let content
  if (isLoading) {
    content = <LoadingSpinner />
  } else if (isSuccess) {
    content = (
      <>
        <AdminSideBar />
        <section className="admin">
          <h1>Administration</h1>

          <article className="users-management">
            <div className="title">
              <h2>Gestion des utilisateurs</h2>
              <hr />
            </div>

            <ul className="users-list">
              {usersList?.users.map((user) => {
                return (
                  <li key={user.id} className="users-list-item">
                    {user.username}
                    <DeleteUserForm userId={user.id} />
                  </li>
                )
              })}
            </ul>
          </article>
        </section>
      </>
    )
  }

  return content
}

export default AdminUsers
