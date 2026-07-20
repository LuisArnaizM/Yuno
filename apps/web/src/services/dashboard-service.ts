import { homeSummaryDtoSchema } from "@yuno/shared-types";
import { apiRequest } from "@/lib/api-client";

export const dashboardService = {
  summary(token: string) {
    return apiRequest({
      path: "/dashboard/summary",
      token,
      schema: homeSummaryDtoSchema,
    });
  },
};
