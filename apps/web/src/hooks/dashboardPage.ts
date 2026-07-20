import { useEffect, useState } from "react";
import type { HomeSummaryDto } from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { dashboardService } from "@/services/dashboard-service";
import { useAppSession } from "@/providers/app-session-provider";

export function useDashboardPage() {
  const session = useAppSession();
  const [summary, setSummary] = useState<HomeSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    setIsLoading(true);
    setError(null);

    try {
      if (!session.token) {
        setSummary(null);
        return;
      }

      setSummary(await dashboardService.summary(session.token));
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo cargar el dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [session.token]);

  return {
    ...session,
    summary,
    error,
    isLoading,
    refresh,
  };
}
