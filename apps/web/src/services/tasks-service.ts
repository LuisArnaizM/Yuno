import {
  createTaskDtoSchema,
  taskDtoSchema,
  updateTaskDtoSchema,
} from "@yuno/shared-types";
import { apiRequest } from "@/lib/api-client";

export const tasksService = {
  list(token: string) {
    return apiRequest({
      path: "/tasks",
      token,
      schema: taskDtoSchema.array(),
    });
  },

  listAssigned(token: string) {
    return apiRequest({
      path: "/tasks/me",
      token,
      schema: taskDtoSchema.array(),
    });
  },

  create(token: string, input: unknown) {
    return apiRequest({
      path: "/tasks",
      method: "POST",
      token,
      body: createTaskDtoSchema.parse(input),
      schema: taskDtoSchema,
    });
  },

  update(token: string, taskId: number, input: unknown) {
    return apiRequest({
      path: `/tasks/${taskId}`,
      method: "PATCH",
      token,
      body: updateTaskDtoSchema.parse(input),
      schema: taskDtoSchema,
    });
  },
};
