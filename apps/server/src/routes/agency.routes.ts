import { Hono } from "hono";
import { getAllAgenciesHandler, getAgencyHandler, createAgencyHandler, updateAgencyHandler, manageMembershipHandler } from "../handlers/agency.handler";
import { authMiddleware } from "../middleware/auth";

const agencyRoutes = new Hono();

agencyRoutes.get("/", getAllAgenciesHandler);
agencyRoutes.get("/:id", getAgencyHandler);

agencyRoutes.post("/", authMiddleware, createAgencyHandler);
agencyRoutes.patch("/:id", authMiddleware, updateAgencyHandler);
agencyRoutes.post("/:id/members", authMiddleware, manageMembershipHandler);

export default agencyRoutes;
