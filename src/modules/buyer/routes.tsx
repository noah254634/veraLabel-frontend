import React from 'react'
import {Route, Routes} from "react-router-dom"
import BuyerLayout from '../buyer/layout/BuyerLayout'
import Order from './pages/Order'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderDetails from './pages/OrderDetails'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import Settings from './pages/Settings'

function BuyerRoutes() {
  return (
    <Routes>
      <Route  element={<BuyerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='browse' element={<Browse />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='order' element={<Order />} />
        <Route path='order/:id' element={<OrderDetails />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default BuyerRoutes