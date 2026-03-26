import React, { useState , useEffect} from 'react'
import { authFetch } from "../utils/authFetch";
import Header from '../components/Dashboard/HeaderDashboard'
import SearchBar from '../components/Dashboard/SearchBarDashbord'
import TrendingStyles from '../components/Dashboard/TrendingStyles'
import PopularTailors from '../components/Dashboard/PopularTailors'
import Features from '../components/Dashboard/Features'
import Footer from '../components/Dashboard/FooterDashbord'
import PhoneFooter from '../components/Dashboard/PhoneFotter'

const Dashboard = () => {

    useEffect(() => {
  const getProfile = async () => {
    const res = await authFetch("http://localhost:5000/api/user/profile");

    const data = await res.json();
    console.log(data);
  };

  getProfile();
}, []);

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
