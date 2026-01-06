import { Hono } from "hono";
import { uploadFileHandler } from "../handlers/upload.handler";
import { authMiddleware } from "../middleware/auth";

const uploadRoutes = new Hono();

uploadRoutes.use("/*", authMiddleware);

uploadRoutes.post("/", uploadFileHandler);

export default uploadRoutes;
