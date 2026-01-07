import { db, education } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class EducationRepository {
    async findById(id: string) {
        const [result] = await db.select().from(education).where(eq(education.id, id)).limit(1);
        return result;
    }

    async findByProfileId(profileId: string) {
        return await db.select().from(education).where(eq(education.profileId, profileId));
    }

    async create(data: typeof education.$inferInsert) {
        const [result] = await db.insert(education).values(data).returning();
        return result;
    }

    async update(id: string, data: Partial<typeof education.$inferInsert>) {
        const [result] = await db.update(education).set(data).where(eq(education.id, id)).returning();
        return result;
    }

    async delete(id: string) {
        const [result] = await db.delete(education).where(eq(education.id, id)).returning();
        return result;
    }
}

export const educationRepository = new EducationRepository();
