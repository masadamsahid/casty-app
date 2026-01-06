import { Hono } from "hono";
import { getMyApplicationsHandler, getApplicationHandler, applyCastingHandler, updateApplicationStatusHandler } from "../handlers/application.handler";
import { authMiddleware } from "../middleware/auth";

const applicationRoutes = new Hono();

applicationRoutes.use("/*", authMiddleware);

applicationRoutes.get("/me", getMyApplicationsHandler);
applicationRoutes.get("/:id", getApplicationHandler);
applicationRoutes.post("/", applyCastingHandler);
applicationRoutes.patch("/:id/status", updateApplicationStatusHandler);

export default applicationRoutes;
