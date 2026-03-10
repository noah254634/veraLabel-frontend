import React from 'react'
import {Route, Routes} from "react-router-dom"
import BuyerLayout from '../buyer/layout/BuyerLayout'
import Order from './pages/Order'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import Settings from './pages/Settings'
import Logout from '../auth/logout'


function BuyerRoutes() {
  return (
    <Routes>
      <Route  element={<BuyerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='browse' element={<Browse />} />
        <Route path='order' element={<Order />} />
        <Route path='settings' element={<Settings />} />
        <Route path='logout' element={<Logout />} />
      </Route>
    </Routes>
  )
}

export default BuyerRoutes