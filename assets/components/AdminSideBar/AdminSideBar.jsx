import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faUsers } from "@fortawesome/free-solid-svg-icons"

import "./AdminSideBar.css"

const AdminSideBar = () => {

  const content = (
    <div className="sidebar">
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to={"/admin"} >
            <FontAwesomeIcon icon={faHouse} />
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to={"/admin/users"} >
            <FontAwesomeIcon icon={faUsers} />
          </Link>
        </li>
      </ul>
    </div>
  )

  return content
}

export default AdminSideBar