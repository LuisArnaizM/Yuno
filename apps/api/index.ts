import { Elysia } from "elysia";
import type { User } from "@yuno/shared-types";

const users: User[] = [{ id: 1, nombre: "Luis" }];

const app = new Elysia()
  .get("/", () => "API viva")
  .get("/users", () => users)
  .listen(3001);

console.log(`API corriendo en http://localhost:${app.server?.port}`);
