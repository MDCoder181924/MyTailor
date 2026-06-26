import React from 'react'
import Header from '../../components/Tailor/header'
import HeroSection from '../../components/Tailor/Dashboard/HeroSection'
import DashboardCards from '../../components/Tailor/Dashboard/DashboardCards'
import SalesAndOrders from '../../components/Tailor/Dashboard/SalesAndOrders'

const Dashboard = () => {
  return (
    <div className='bg-theme-bg min-h-screen pb-12 w-full transition-colors duration-300'>
      <Header/>
      <HeroSection/>
      <DashboardCards/>
      <SalesAndOrders/>
    </div>
  )
}

export default Dashboard
