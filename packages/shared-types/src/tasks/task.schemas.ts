import { z } from "zod";
import { projectDtoSchema } from "../projects/project.schemas";
import { tagDtoSchema } from "../tags/tag.schemas";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const createTaskDtoSchema = z.object({
  title: z.string().trim().min(1, "El titulo es obligatorio").max(120),
  description: z.string().trim().max(500).optional(),
  projectId: z.number().int().positive().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const taskDtoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  projectId: z.number().int().positive().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  project: projectDtoSchema.nullable().optional(),
  assignee: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
      email: z.email(),
    })
    .nullable()
    .optional(),
  tags: z.array(tagDtoSchema).default([]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>;
export type TaskDto = z.infer<typeof taskDtoSchema>;
