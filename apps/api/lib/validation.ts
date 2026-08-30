import { type ZodError } from "zod";
import { ValidationError } from "@/lib/errors";

export function invalidPayloadResponse(error: ZodError) {
  return new ValidationError(error).toResponse();
}
