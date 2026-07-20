import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSession } from "@/providers/app-session-provider";

export function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();
  const session = useAppSession();

  if (session.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Cargando sesion...</p>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}
