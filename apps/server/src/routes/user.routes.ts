import { Hono } from "hono";
import { getMeHandler, updateProfileHandler, updateSettingsHandler } from "../handlers/user.handler";
import { authMiddleware } from "../middleware/auth";

const userRoutes = new Hono();

userRoutes.use("/*", authMiddleware);

userRoutes.get("/me", getMeHandler);
userRoutes.patch("/profile", updateProfileHandler);
userRoutes.patch("/settings", updateSettingsHandler);

export default userRoutes;
