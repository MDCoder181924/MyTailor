import React from 'react'
import Header from '../../components/Tailor/header'
import OrdersCards from '../../components/Tailor/OrderListPage/OrdersCards'
import OrdersTable from '../../components/Tailor/OrderListPage/OrdersTable'

const OrdersList = () => {
  return (
    <div className="bg-theme-bg min-h-screen pb-12 w-full transition-colors duration-300">
      <Header/>
      <OrdersCards/>
      <OrdersTable/>
    </div>
  )
}

export default OrdersList
