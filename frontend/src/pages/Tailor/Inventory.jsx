import React from 'react'
import FabricsFooter from "../../components/Tailor/Inventory/FabricsFooter"
import FabricsGrid from "../../components/Tailor/Inventory/FabricsGrid"
import FabricsHeader from "../../components/Tailor/Inventory/FabricsHeader"
import Header from '../../components/Tailor/header'

const Inventory = () => {
    return (
        <div>
            <Header />
            <FabricsHeader />
            <FabricsGrid />
            <FabricsFooter />
        </div>
    )
}

export default Inventory
