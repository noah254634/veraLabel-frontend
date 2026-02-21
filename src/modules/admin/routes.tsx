import { Route } from "react-router-dom"
import { AdminLayout } from "./layout/AdminLayout"
import AdminDashboard from "./pages/Dashboard"

export const AdminRoutes = (
  <Route path="admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
  </Route>
)
