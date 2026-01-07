import { auth } from "@casty-app/auth";
import { env } from "@casty-app/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import userRoutes from "./routes/user.routes";
import agencyRoutes from "./routes/agency.routes";
import castingRoutes from "./routes/casting.routes";
import applicationRoutes from "./routes/application.routes";
import chatRoutes from "./routes/chat.routes";
import uploadRoutes from "./routes/upload.routes";
import talentRoutes from "./routes/talent.routes";
import { errorHandler } from "./middleware/error-handler";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.onError(errorHandler);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/users", userRoutes);
app.route("/api/agencies", agencyRoutes);
app.route("/api/castings", castingRoutes);
app.route("/api/applications", applicationRoutes);
app.route("/api/chat", chatRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api/talents", talentRoutes);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
