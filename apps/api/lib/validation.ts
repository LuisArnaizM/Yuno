import { flattenError, type ZodError } from "zod";

export function invalidPayloadResponse(error: ZodError) {
  return {
    status: 400 as const,
    body: {
      message: "Payload invalido",
      issues: flattenError(error),
    },
  };
}
