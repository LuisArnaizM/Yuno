import { app } from "@/app";

const server = app.listen(3001);

console.log(`API corriendo en http://localhost:${server.server?.port}`);
