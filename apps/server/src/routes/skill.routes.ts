import { Hono } from "hono";
import { searchSkillsHandler } from "../handlers/skill.handler";

const skillRoutes = new Hono();

skillRoutes.get("/search", searchSkillsHandler);

export default skillRoutes;
