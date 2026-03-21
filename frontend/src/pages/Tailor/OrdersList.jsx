import React from 'react'
import Header from '../../components/Tailor/header'
import OrdersCards from '../../components/Tailor/OrderListPage/OrdersCards'
import OrdersTable from '../../components/Tailor/OrderListPage/OrdersTable'

const OrdersList = () => {
  return (
    <div>
        <Header/>
      <OrdersCards/>
      <OrdersTable/>
    </div>
  )
}

export default OrdersList
