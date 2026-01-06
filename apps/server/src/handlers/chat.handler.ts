import type { Context } from "hono";
import { chatService } from "../services/chat.service";
import { successResponse, errorResponse } from "../lib/response";

export const getRoomMessagesHandler = async (c: Context) => {
    try {
        const roomId = c.req.param("roomId");
        const data = await chatService.getRoomMessages(roomId);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const sendMessageHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const roomId = c.req.param("roomId");
        const { content, type } = await c.req.json();
        const data = await chatService.sendMessage(user.id, roomId, content, type);
        return successResponse(c, data, "Message sent successfully", 201);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
