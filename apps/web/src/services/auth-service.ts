import {
  createUserSchema,
  loginSchema,
  userDtoSchema,
} from "@yuno/shared-types";
import { z } from "zod";
import { apiRequest } from "@/lib/api-client";

const authResponseSchema = z.object({
  user: userDtoSchema,
  token: z.string().min(1),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const authService = {
  register(input: unknown) {
    return apiRequest({
      path: "/auth/register",
      method: "POST",
      body: createUserSchema.parse(input),
      schema: authResponseSchema,
    });
  },

  login(input: unknown) {
    return apiRequest({
      path: "/auth/login",
      method: "POST",
      body: loginSchema.parse(input),
      schema: authResponseSchema,
    });
  },

  getCurrentUser(token: string) {
    return apiRequest({
      path: "/auth/me",
      token,
      schema: userDtoSchema,
    });
  },
};
