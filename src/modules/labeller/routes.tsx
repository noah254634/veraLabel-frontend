import { Route, Routes } from 'react-router-dom'
import { LabellerLayout } from './layout/LabellerLayout'
import { LabellerDashboard } from './pages/Dashboard'
import { FindWorkPage } from './pages/FindWorkPage'
import { WalletPage } from './pages/ProfileAndWallet'
import { WorkbenchPage } from './pages/Workbench'
import { SettingsPage } from './pages/Settings'
import { OnboardingEnforcer } from './onboarding/Onboarding'
function LabellerRoutes() {
  return (
    <Routes>
      <Route element={<LabellerLayout />}>
        <Route index element={<LabellerDashboard />} />
        <Route path="work" element={<FindWorkPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="workbench" element={<WorkbenchPage />} />
        <Route path="settings" element={<SettingsPage/>}/>
        <Route path="onboarding" element={<OnboardingEnforcer />} />
      </Route>
    </Routes>
  )
}
export default LabellerRoutes