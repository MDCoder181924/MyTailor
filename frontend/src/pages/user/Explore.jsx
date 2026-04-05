import React from 'react'
import CategoryNames from '../../components/user/Explore/CategoryNames'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import CategoryItems from '../../components/user/Explore/CategoryItems'
import SearchBar from '../../components/user/Dashboard/SearchBarDashbord'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'


const Explore = () => {
  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <Header/>
      <SearchBar/>
      <CategoryNames />
      <CategoryItems category="All"/>
      <PhoneFooter />
    </div>
  )
}

export default Explore
