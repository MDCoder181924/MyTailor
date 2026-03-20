import React, { useState } from 'react'
import Header from '../components/Dashboard/HeaderDashboard'
import SearchBar from '../components/Dashboard/SearchBarDashbord'
import TrendingStyles from '../components/Dashboard/TrendingStyles'
import PopularTailors from '../components/Dashboard/PopularTailors'
import Features from '../components/Dashboard/Features'
import Footer from '../components/Dashboard/FooterDashbord'
import CategoryNames from '../components/Dashboard/Explore/CategoryNames'
import CategoryItems from '../components/Dashboard/Explore/CategoryItems'

const Dashboard = () => {
    const [explorclick, setExplorclick] = useState(false);
    const [category, setCategory] = useState("All");

    return (
        <div className='bg-black h-full w-full'>
            <Header setExplorclick={setExplorclick} setCategory={setCategory} />
            <SearchBar />
            {explorclick ? (
                <>
                < CategoryNames setCategory={setCategory} />
            <CategoryItems category={category} />
            </>
            ) : (
                <>
                    <TrendingStyles />
                    <PopularTailors />
                    <Features />
                    <Footer />
                </>
            )
            }
        </div>
    )
}

export default Dashboard
