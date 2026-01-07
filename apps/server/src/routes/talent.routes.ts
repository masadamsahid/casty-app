import { Hono } from "hono";
import { getTalentsHandler, getTalentHandler } from "../handlers/talent.handler";

const talentRoutes = new Hono();

talentRoutes.get("/", getTalentsHandler);
talentRoutes.get("/:id", getTalentHandler);

export default talentRoutes;
