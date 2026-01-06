import { db, chatRoom, chatMessage } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class ChatRepository {
    async findRoomById(roomId: string) {
        return await db.query.chatRoom.findFirst({
            where: eq(chatRoom.id, roomId),
            with: {
                application: {
                    with: {
                        casting: true,
                        talent: true,
                    }
                },
                messages: {
                    orderBy: (m, { asc }) => [asc(m.createdAt)],
                    limit: 100,
                }
            }
        });
    }

    async findMessagesByRoom(roomId: string) {
        return await db.query.chatMessage.findMany({
            where: eq(chatMessage.roomId, roomId),
            orderBy: (m, { asc }) => [asc(m.createdAt)],
        });
    }

    async createMessage(data: typeof chatMessage.$inferInsert) {
        const [result] = await db.insert(chatMessage).values(data).returning();
        return result;
    }
}

export const chatRepository = new ChatRepository();
