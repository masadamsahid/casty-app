import { db, application, chatRoom } from "@casty-app/db";
import { eq, and } from "drizzle-orm";

export class ApplicationRepository {
    async findAllByUserId(userId: string) {
        return await db.query.application.findMany({
            where: eq(application.talentId, userId),
            with: {
                casting: true,
                agency: true,
            },
            orderBy: (a, { desc }) => [desc(a.createdAt)],
        });
    }

    async findAllByCastingId(castingId: string) {
        return await db.query.application.findMany({
            where: eq(application.castingId, castingId),
            with: {
                talent: {
                    with: {
                        profile: true,
                    }
                },
                agency: true,
            },
            orderBy: (a, { desc }) => [desc(a.createdAt)],
        });
    }

    async findById(id: string) {
        return await db.query.application.findFirst({
            where: eq(application.id, id),
            with: {
                casting: {
                    with: {
                        manager: true,
                    }
                },
                talent: {
                    with: {
                        profile: true,
                    }
                },
                agency: true,
                chatRoom: true,
            }
        });
    }

    async create(data: typeof application.$inferInsert) {
        const [result] = await db.insert(application).values(data).returning();
        return result;
    }

    async updateStatus(id: string, status: "shortlisted" | "accepted" | "rejected" | "pending") {
        const [result] = await db.update(application).set({ status }).where(eq(application.id, id)).returning();
        return result;
    }

    async findByCastingAndTalent(castingId: string, talentId: string) {
        return await db.query.application.findFirst({
            where: and(eq(application.castingId, castingId), eq(application.talentId, talentId)),
        });
    }

    async createChatRoom(applicationId: string, id: string) {
        const [result] = await db.insert(chatRoom).values({ id, applicationId }).returning();
        return result;
    }
}

export const applicationRepository = new ApplicationRepository();
