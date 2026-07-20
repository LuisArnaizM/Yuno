import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "@/routes/auth.routes";
import { dashboardRoutes } from "@/routes/dashboard.routes";
import { projectRoutes } from "@/routes/project.routes";
import { tagRoutes } from "@/routes/tag.routes";
import { taskRoutes } from "@/routes/task.routes";

const allowedOrigins = (
  process.env.CORS_ORIGINS ?? "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      Boolean(url.port)
    );
  } catch {
    return false;
  }
}

export const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        return allowedOrigins.includes(origin) || isLocalOrigin(origin);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Yuno API",
          version: "0.1.0",
          description: "API de ejemplo con Elysia + Drizzle + SQLite",
        },
        tags: [
          { name: "Dashboard" },
          { name: "Tasks" },
          { name: "Projects" },
          { name: "Tags" },
          { name: "Users" },
        ],
      },
    }),
  )
  .get("/", () => "API viva")
  .use(authRoutes)
  .use(dashboardRoutes)
  .use(taskRoutes)
  .use(projectRoutes)
  .use(tagRoutes);
