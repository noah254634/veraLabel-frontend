import ReviewerDashboard from "../pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import { ReviewerLayout } from "../layout/reviewerLayout";
import AuditReviewV2 from "../pages/AuditQueueV2";

function ReviewerRoutes() {
  return (
    <Routes>
      <Route element={<ReviewerLayout />}>
        <Route index element={<ReviewerDashboard />} />
        <Route path="dashboard" element={<ReviewerDashboard />} />
        <Route path="queue" element={<AuditReviewV2 />} />
      </Route>
    </Routes>
  );
}

export default ReviewerRoutes;