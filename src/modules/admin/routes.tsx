import { Route } from "react-router-dom"
import { AdminLayout } from "./layout/AdminLayout"
import AdminDashboard from "./pages/Dashboard"
import DatasetAdminPage from "./pages/Datasets"
import SettingsPage from "./pages/Settings"
import HelpPage from "./pages/help"
import AdminProjectsPage from "./pages/Projects"
import AdminUserModule from "./pages/Users"
import ModelsPage from "./pages/Models"
import useAdminStore from "./store/userManagementStore"
export const AdminRoutes = (
  <Route path="admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="datasets" element={<DatasetAdminPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="projects" element={<AdminProjectsPage />} />
    <Route path="users" element={<AdminUserModule useAdminStore={useAdminStore} />} />
    <Route path="models" element={<ModelsPage />} />
  </Route>
)
