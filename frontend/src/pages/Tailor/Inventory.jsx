import React from 'react'
import FabricsFooter from "../../components/Tailor/Inventory/FabricsFooter"
import FabricsGrid from "../../components/Tailor/Inventory/FabricsGrid"
import FabricsHeader from "../../components/Tailor/Inventory/FabricsHeader"
import Header from '../../components/Tailor/header'
import TailorPhoneFooter from '../../components/Tailor/TailorPhoneFooter'

const Inventory = () => {
    return (
        <div className="bg-theme-bg min-h-screen pb-24 w-full transition-colors duration-300">
            <Header />
            <FabricsHeader />
            <FabricsGrid />
            <FabricsFooter />
            <TailorPhoneFooter />
        </div>
    )
}

export default Inventory
