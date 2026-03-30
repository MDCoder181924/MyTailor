import React from 'react'
import { useParams } from "react-router-dom";
import CategoryNames from '../../components/user/Explore/CategoryNames'
import CategoryItems from '../../components/user/Explore/CategoryItems'
import Header from '../../components/user/Dashboard/HeaderDashboard'
import SearchBar from '../../components/user/Dashboard/SearchBarDashbord'

const ExploreCategory = () => {
    const { category } = useParams();
    const selected = category ? decodeURIComponent(category) : "All";
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
