import { flattenError, type ZodError } from "zod";

export type ApiErrorResponse = {
  status: number;
  body: {
    message: string;
    details?: unknown;
    issues?: unknown;
  };
};

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "APP_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }

  toResponse(): ApiErrorResponse {
    const body: ApiErrorResponse["body"] = { message: this.message };

    if (this.details !== undefined) {
      body.details = this.details;
    }

    return {
      status: this.status,
      body,
    };
  }
}

export class ValidationError extends AppError {
  constructor(error: ZodError) {
    super(400, "Payload invalido", "VALIDATION_ERROR", flattenError(error));
  }

  override toResponse(): ApiErrorResponse {
    return {
      status: this.status,
      body: {
        message: this.message,
        issues: this.details,
      },
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "No encontrado") {
    super(404, message, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto") {
    super(409, message, "CONFLICT");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Error interno del servidor") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}
