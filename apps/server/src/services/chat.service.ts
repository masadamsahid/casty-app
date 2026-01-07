import { chatRepository } from "../repositories/chat.repository";
import { v4 as uuidv4 } from "uuid";

export class ChatService {
    async getRoomMessages(roomId: string) {
        const room = await chatRepository.findRoomById(roomId);
        if (!room) throw new Error("Chat room not found");
        return room.messages;
    }

    async sendMessage(userId: string, roomId: string, content: string, type: "text" | "image" = "text") {
        const room = await chatRepository.findRoomById(roomId);
        if (!room) throw new Error("Chat room not found");

        // Check if user is part of the application (talent or manager)
        const application = room.application;
        if (application.talentId !== userId && application.casting.managerId !== userId) {
            throw new Error("Unauthorized to access this chat");
        }

        return await chatRepository.createMessage({
            id: uuidv4(),
            roomId,
            senderId: userId,
            content,
            type,
        });
    }
}

export const chatService = new ChatService();
