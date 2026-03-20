import React from 'react'
import CategoryNames from '../components/Explore/CategoryNames'
import Header from '../components/Dashboard/HeaderDashboard'
import CategoryItems from '../components/Explore/CategoryItems'
import SearchBar from '../components/Dashboard/SearchBarDashbord'


const Explore = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Header/>
      <SearchBar/>
      <CategoryNames />
      <CategoryItems category="All"/>
    </div>
  )
}

export default Explore
