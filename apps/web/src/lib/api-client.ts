import { z, type ZodType } from "zod";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const apiErrorSchema = z.object({
  message: z.string(),
  issues: z.unknown().optional(),
});

type ApiRequestOptions<TResponse> = {
  path: string;
  schema: ZodType<TResponse>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function parsePayload(rawText: string) {
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return rawText;
  }
}

function buildErrorMessage(status: number, payload: unknown) {
  const parsedError = apiErrorSchema.safeParse(payload);

  if (parsedError.success) {
    return parsedError.data.message;
  }

  if (status === 401) {
    return "No autorizado";
  }

  return "La solicitud a la API ha fallado";
}

export async function apiRequest<TResponse>({
  path,
  schema,
  method = "GET",
  body,
  token,
  headers,
}: ApiRequestOptions<TResponse>): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  const payload = parsePayload(rawText);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload,
      buildErrorMessage(response.status, payload),
    );
  }

  return schema.parse(payload);
}
