import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const createTaskDtoSchema = z.object({
  title: z.string().trim().min(1, "El titulo es obligatorio").max(120),
  description: z.string().trim().max(500).optional(),
});

export const taskDtoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>;
export type TaskDto = z.infer<typeof taskDtoSchema>;
