import React from 'react'
import Header from '../../components/Tailor/header'
import HeroSection from '../../components/Tailor/Dashboard/HeroSection'
import DashboardCards from '../../components/Tailor/Dashboard/DashboardCards'
import SalesAndOrders from '../../components/Tailor/Dashboard/SalesAndOrders'

const Dashboard = () => {
  return (
    <div className='bg-black h-full w-full'>
      <Header/>
      <HeroSection/>
      <DashboardCards/>
      <SalesAndOrders/>
    </div>
  )
}

export default Dashboard
