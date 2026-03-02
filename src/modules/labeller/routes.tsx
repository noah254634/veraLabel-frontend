import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { LabellerLayout } from './layout/LabellerLayout'
import { LabellerDashboard } from './pages/Dashboard'
import { FindWorkPage } from './pages/FindWorkPage'
import { WalletPage } from './pages/Profile&Wallet'
import { WorkbenchPage } from './pages/Workbench'
import { SettingsPage } from './pages/Settings'

function LabellerRoutes() {
  return (
    <Routes>
      <Route element={<LabellerLayout />}>
        <Route index element={<LabellerDashboard />} />
        <Route path="work" element={<FindWorkPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="workbench" element={<WorkbenchPage />} />
        <Route path="settings" element={<SettingsPage/>}/>
      </Route>
    </Routes>
  )
}
export default LabellerRoutes