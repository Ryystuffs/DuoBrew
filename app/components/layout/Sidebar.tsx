import React from 'react'
import { logout } from '@/lib/actions/auth'
const Sidebar = () => {
  return (
    <div><button onClick={logout} className="text-white">Signout</button></div>
  )
}

export default Sidebar