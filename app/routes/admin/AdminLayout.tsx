import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
      Mobilesidebar
      <aside className='children'>
        <Outlet />
      </aside>
    </div>
  )
}

export default AdminLayout