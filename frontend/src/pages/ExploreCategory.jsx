import React from 'react'
import { useParams } from "react-router-dom";
import CategoryNames from '../components/Explore/CategoryNames'
import CategoryItems from '../components/Explore/CategoryItems'
import Header from '../components/Dashboard/HeaderDashboard'
import SearchBar from '../components/Dashboard/SearchBarDashbord'

const ExploreCategory = () => {
    const { category } = useParams();
    const selected = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "All";
    return (
        <div className="bg-black min-h-screen text-white">
            <Header />
            <SearchBar />
            <CategoryNames />
            <CategoryItems category={selected} />
        </div>
    )
}

export default ExploreCategory
