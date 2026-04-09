import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import "@/layouts/layout.css";

export function PublicLayout() {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) return null;

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from;
    const path = from?.pathname ?? "/";
    return <Navigate to={path} replace />;
  }

  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

