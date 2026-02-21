import { AppLayout } from "../../../shared/components/AppLayout"
import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/AdminSidebar"

export function AdminLayout() {
  return (
    <AppLayout sidebar={<AdminSidebar />}>
      <Outlet />
    </AppLayout>
  )
}
