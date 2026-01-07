import { Hono } from "hono";
import { getCastingsHandler, getCastingHandler, createCastingHandler, updateCastingHandler, deleteCastingHandler, getCategoriesHandler, getMyCastingsHandler } from "../handlers/casting.handler";
import { authMiddleware } from "../middleware/auth";

const castingRoutes = new Hono();

castingRoutes.get("/", getCastingsHandler);
castingRoutes.get("/my", authMiddleware, getMyCastingsHandler);
castingRoutes.get("/categories", getCategoriesHandler);
castingRoutes.get("/:id", getCastingHandler);

castingRoutes.post("/", authMiddleware, createCastingHandler);
castingRoutes.patch("/:id", authMiddleware, updateCastingHandler);
castingRoutes.delete("/:id", authMiddleware, deleteCastingHandler);

export default castingRoutes;
