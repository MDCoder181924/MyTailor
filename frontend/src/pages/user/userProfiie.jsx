import React from 'react'
import SettingsProfile from '../../components/user/profile/SettingsProfile'
import Header from '../../components/user/Dashboard/HeaderDashboard'

const UserProfiie = () => {
  return (
    <div className='bg-black min-h-screen'>
      <Header />
      <SettingsProfile />
    </div>
  )
}

export default UserProfiie
