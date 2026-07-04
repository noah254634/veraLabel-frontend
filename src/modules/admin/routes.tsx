import { Route } from "react-router-dom"
import { AdminLayout } from "./layout/AdminLayout"
import AdminDashboard from "./pages/Dashboard"
import DatasetAdminPage from "./pages/Datasets"
import SettingsPage from "./pages/Settings"
import HelpPage from "./pages/help"
import AdminUserModule from "./pages/Users"
import ModelsPage from "./pages/Models"
import AnalyticsHub from "./pages/Analytics/AnalyticsHub"
import { InstructionManager } from "./pages/InstructionManager"
import TaskGenerator from "./pages/TaskGenerator"
import NotificationTester from "../../NotificationTester"
import SecurityPage from "./pages/Security"
export const AdminRoutes = (
  <Route path="admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="analytics" element={<AnalyticsHub />} />
    <Route path="protocols" element={<InstructionManager />} />
    <Route path="generator" element={<TaskGenerator />} />
    <Route path="datasets" element={<DatasetAdminPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="users" element={<AdminUserModule />} />
    <Route path="models" element={<ModelsPage />} />
    <Route path="security" element={<SecurityPage />} />
    <Route path="notifications" element={<NotificationTester />} />
  </Route>
)
