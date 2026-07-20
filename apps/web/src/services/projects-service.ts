import { createProjectDtoSchema, projectDtoSchema } from "@yuno/shared-types";
import { apiRequest } from "@/lib/api-client";

export const projectsService = {
  list(token: string) {
    return apiRequest({
      path: "/projects",
      token,
      schema: projectDtoSchema.array(),
    });
  },

  create(token: string, input: unknown) {
    return apiRequest({
      path: "/projects",
      method: "POST",
      token,
      body: createProjectDtoSchema.parse(input),
      schema: projectDtoSchema,
    });
  },
};
