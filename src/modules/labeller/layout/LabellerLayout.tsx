import type { ReactNode } from "react";
import { LabellerSidebar } from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../auth/useAuthstore";
import { OnboardingEnforcer } from "../onboarding/Onboarding";
import { AppLayout } from "../../../shared/components/AppLayout";

export const LabellerLayout = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const role = user ? String(user.role).toLowerCase() : "";
  const onboardingKey = user ? `labellerOnboardingCompleted:${user._id ?? user.email}` : null;
  const onboardingCompleted = onboardingKey ? localStorage.getItem(onboardingKey) === "true" : false;
  
  const shouldForceOnboarding =
    (role === "labeler" || role === "labeller") &&
    !onboardingCompleted &&
    !location.pathname.startsWith("/labeller/onboarding");

  const getHeaderTitle = () => {
    const pathSegment = location.pathname.split("/").pop() || "dashboard";
    return `// ${pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)}`;
  };

  return (
    <>
      {shouldForceOnboarding && <OnboardingEnforcer />}
      <AppLayout 
        sidebar={<LabellerSidebar />}
        header={getHeaderTitle()}
      >
        {children || <Outlet />}
      </AppLayout>
    </>
  );
};