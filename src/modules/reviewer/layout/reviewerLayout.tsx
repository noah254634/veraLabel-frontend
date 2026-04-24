import { Outlet } from "react-router-dom"
import { AppLayout } from "../../../shared/components/AppLayout"
import { ReviewerSidebar } from "../components/reviewerSidebar"
export function ReviewerLayout() {
  return (
    <AppLayout sidebar={<ReviewerSidebar />}>
      <Outlet />
    </AppLayout>
  )
}