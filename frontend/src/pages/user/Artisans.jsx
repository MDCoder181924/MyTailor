import React from 'react'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import TailorList from '../../components/user/Artisans/TailorList'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'

const Artisans = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
        <Header/>
        <TailorList/>
        <PhoneFooter />
    </div>
  )
}

export default Artisans
