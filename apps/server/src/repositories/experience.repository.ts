import { db, experience } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class ExperienceRepository {
    async findById(id: string) {
        const [result] = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
        return result;
    }

    async findByProfileId(profileId: string) {
        return await db.select().from(experience).where(eq(experience.profileId, profileId));
    }

    async create(data: typeof experience.$inferInsert) {
        const [result] = await db.insert(experience).values(data).returning();
        return result;
    }

    async update(id: string, data: Partial<typeof experience.$inferInsert>) {
        const [result] = await db.update(experience).set(data).where(eq(experience.id, id)).returning();
        return result;
    }

    async delete(id: string) {
        const [result] = await db.delete(experience).where(eq(experience.id, id)).returning();
        return result;
    }
}

export const experienceRepository = new ExperienceRepository();
