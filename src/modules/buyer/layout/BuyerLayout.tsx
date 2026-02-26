import React from 'react'
import { AppLayout } from '../../../shared/components/AppLayout'
import { Outlet } from 'react-router-dom'
import BuyerSideBar from '../components/buyerSideBar'

function BuyerLayout() {
  return (
    <AppLayout sidebar={<BuyerSideBar />}>
        <Outlet />
    </AppLayout>
  )
}

export default BuyerLayout