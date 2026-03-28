import React from 'react'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import SearchBar from '../../components/user/Dashboard/SearchBarDashbord'
import TrendingStyles from '../../components/user/Dashboard/TrendingStyles'
import PopularTailors from '../../components/user/Dashboard/PopularTailors'
import Features from '../../components/user/Dashboard/Features'
import Footer from '../../components/user/Dashboard/FooterDashbord'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'

const Dashboard = () => {
    return (
        <div className='bg-black h-full w-full'>
            <Header />
            <SearchBar />
            <TrendingStyles />
            <PopularTailors />
            <Features />
            <Footer />
            <PhoneFooter />
        </div>
    )
}

export default Dashboard
