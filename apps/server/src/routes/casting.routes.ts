import { Hono } from "hono";
import { getCastingsHandler, getCastingHandler, createCastingHandler, updateCastingHandler, deleteCastingHandler, getCategoriesHandler } from "../handlers/casting.handler";
import { authMiddleware } from "../middleware/auth";

const castingRoutes = new Hono();

castingRoutes.get("/", getCastingsHandler);
castingRoutes.get("/categories", getCategoriesHandler);
castingRoutes.get("/:id", getCastingHandler);

castingRoutes.post("/", authMiddleware, createCastingHandler);
castingRoutes.patch("/:id", authMiddleware, updateCastingHandler);
castingRoutes.delete("/:id", authMiddleware, deleteCastingHandler);

export default castingRoutes;
