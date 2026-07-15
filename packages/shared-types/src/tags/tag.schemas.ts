import { z } from "zod";

export const tagDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  color: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createTagDtoSchema = z.object({
  name: z.string().trim().min(1, "El nombre del tag es obligatorio").max(80),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "El color debe ser un hex valido")
    .optional(),
});

export type TagDto = z.infer<typeof tagDtoSchema>;
export type CreateTagDto = z.infer<typeof createTagDtoSchema>;
