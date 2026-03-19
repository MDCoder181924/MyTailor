import React from 'react'
import Header from '../components/Dashboard/HeaderDashboard'
import SearchBar from '../components/Dashboard/SearchBarDashbord'
import TrendingStyles from '../components/Dashboard/TrendingStyles'
import PopularTailors from '../components/Dashboard/PopularTailors'
import Features from '../components/Dashboard/Features'
import Footer from '../components/Dashboard/FooterDashbord'

const Dashboard = () => {
  return (
    <div className='bg-black h-full w-full'>
      <Header/>
      <SearchBar/>
      <TrendingStyles/>
      <PopularTailors/>
      <Features/>
      <Footer/>
    </div>
  )
}

export default Dashboard
