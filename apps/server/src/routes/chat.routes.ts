import { Hono } from "hono";
import { getRoomMessagesHandler, sendMessageHandler } from "../handlers/chat.handler";
import { authMiddleware } from "../middleware/auth";

const chatRoutes = new Hono();

chatRoutes.use("/*", authMiddleware);

chatRoutes.get("/room/:roomId", getRoomMessagesHandler);
chatRoutes.post("/room/:roomId", sendMessageHandler);

export default chatRoutes;
