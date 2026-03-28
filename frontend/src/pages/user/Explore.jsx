import React from 'react'
import CategoryNames from '../../components/user/Explore/CategoryNames'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import CategoryItems from '../../components/user/Explore/CategoryItems'
import SearchBar from '../../components/user/Dashboard/SearchBarDashbord'


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
