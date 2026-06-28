import type { ReactNode } from "react";
import { useEffect } from "react";
import { LabellerSidebar } from "../components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/useAuthstore";
import { OnboardingEnforcer } from "../onboarding/Onboarding";
import { AppLayout } from "../../../shared/components/AppLayout";
import { useLabelerStore } from "../store/labelerStore";
import { initGlobalWorker } from "../pages/Workbench";

export const LabellerLayout = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const { user } = useAuthStore();
  const { getLabeller, labeller } = useLabelerStore();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user ? String(user.role).toLowerCase() : "";
  const onboardingKey = user ? `labellerOnboardingCompleted:${user._id ?? user.email}` : null;
  const onboardingCompleted =
    (onboardingKey ? localStorage.getItem(onboardingKey) === "true" : false) ||
    !!labeller?.isOnboarded;

  useEffect(() => {
    if (role === "labeler" || role === "labeller") {
      void getLabeller();
      initGlobalWorker();
    }
  }, [getLabeller, role]);

  useEffect(() => {
    if (onboardingCompleted && location.pathname.startsWith("/labeller/onboarding")) {
      navigate("/labeller", { replace: true });
    }
  }, [onboardingCompleted, location.pathname, navigate]);
  
  const shouldForceOnboarding =
    (role === "labeler" || role === "labeller") &&
    !onboardingCompleted &&
    !location.pathname.startsWith("/labeller/onboarding");

  const getHeaderTitle = () => {
    const pathSegment = location.pathname.split("/").pop() || "dashboard";
    return `// ${pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)}`;
  };

  const isWorkbench = location.pathname.endsWith("/workbench");

  return (
    <>
      {shouldForceOnboarding && <OnboardingEnforcer />}
      <AppLayout 
        sidebar={<LabellerSidebar />}
        header={getHeaderTitle()}
        noPadding={isWorkbench}
      >
        {children || <Outlet />}
      </AppLayout>
    </>
  );
};