import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  email: z.email(),
  password: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
});

export const userDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
});

export const loginSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(30, "El nombre no puede tener más de 30 caracteres"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
