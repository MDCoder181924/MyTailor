import React from 'react'
import OrderList from '../../components/user/OrderList/OrderList'
import Headeer from '../../components/user/Dashboard/HeaderDashboard'
import PhoneFooter from '../../components/user/Dashboard/PhoneFotter'

const Order = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <Headeer/>
      <OrderList/>
      <PhoneFooter />
    </div>
  )
}

export default Order
