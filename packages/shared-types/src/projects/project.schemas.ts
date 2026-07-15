import { z } from "zod";

export const projectDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createProjectDtoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del proyecto es obligatorio")
    .max(120),
  description: z.string().trim().max(500).optional(),
});

export type ProjectDto = z.infer<typeof projectDtoSchema>;
export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;
