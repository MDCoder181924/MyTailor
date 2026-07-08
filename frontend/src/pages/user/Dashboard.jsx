import React from 'react'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import SearchBar from '../../components/user/Dashboard/SearchBarDashbord'
import TrendingStyles from '../../components/user/Dashboard/TrendingStyles'
import PopularTailors from '../../components/user/Dashboard/PopularTailors'
import FeaturedProducts from '../../components/Home/FeaturedProducts'
import Features from '../../components/user/Dashboard/Features'
import Footer from '../../components/user/Dashboard/FooterDashbord'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'

const Dashboard = () => {
    return (
        <div className='bg-black min-h-screen w-full pb-24'>
            <Header />
            <SearchBar />
            <TrendingStyles />
            <PopularTailors />
            <FeaturedProducts />
            <Features />
            <Footer />
            <PhoneFooter />
        </div>
    )
}

export default Dashboard
