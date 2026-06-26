import React from 'react'
import OrderList from '../../components/user/OrderList/OrderList'
import Headeer from '../../components/user/Dashboard/HeaderDashboard'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'

const Order = () => {
  return (
    <div className="bg-theme-bg min-h-screen pb-24 transition-colors duration-300">
      <Headeer/>
      <OrderList/>
      <PhoneFooter />
    </div>
  )
}

export default Order
