import { z } from "zod";
import { taskDtoSchema } from "../tasks/task.schemas";

export const homeProjectCardSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  taskCount: z.number().int().nonnegative(),
  inProgressTaskCount: z.number().int().nonnegative(),
  updatedAt: z.iso.datetime(),
});

export const homeStatsSchema = z.object({
  projectsCount: z.number().int().nonnegative(),
  tasksInProgressCount: z.number().int().nonnegative(),
  assignedTasksCount: z.number().int().nonnegative(),
  tagsCount: z.number().int().nonnegative(),
  completionRate: z.number().int().min(0).max(100),
});

export const homeSummaryDtoSchema = z.object({
  stats: homeStatsSchema,
  projects: z.array(homeProjectCardSchema),
  tasksInProgress: z.array(taskDtoSchema),
});

export const projectDetailDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  tasks: z.array(taskDtoSchema),
});

export const updateTaskTagsDtoSchema = z.object({
  tagIds: z.array(z.number().int().positive()),
});

export type HomeProjectCardDto = z.infer<typeof homeProjectCardSchema>;
export type HomeStatsDto = z.infer<typeof homeStatsSchema>;
export type HomeSummaryDto = z.infer<typeof homeSummaryDtoSchema>;
export type ProjectDetailDto = z.infer<typeof projectDetailDtoSchema>;
export type UpdateTaskTagsDto = z.infer<typeof updateTaskTagsDtoSchema>;
