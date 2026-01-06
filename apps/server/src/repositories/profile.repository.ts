import { db, profile } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class ProfileRepository {
    async findByUserId(userId: string) {
        return await db.query.profile.findFirst({
            where: eq(profile.userId, userId),
            with: {
                skills: {
                    with: {
                        skill: true,
                    },
                },
                experiences: true,
                educations: true,
                portfolios: true,
                socialLinks: true,
                galleryPhotos: true,
            },
        });
    }

    async findById(id: string) {
        return await db.query.profile.findFirst({
            where: eq(profile.id, id),
            with: {
                skills: {
                    with: {
                        skill: true,
                    },
                },
                experiences: true,
                educations: true,
                portfolios: true,
                socialLinks: true,
                galleryPhotos: true,
            },
        });
    }

    async create(data: typeof profile.$inferInsert) {
        const [result] = await db.insert(profile).values(data).returning();
        if (!result) throw new Error("Failed to create profile");
        return this.findById(result.id);
    }

    async update(id: string, data: Partial<typeof profile.$inferInsert>) {
        const [result] = await db
            .update(profile)
            .set(data)
            .where(eq(profile.id, id))
            .returning();
        if (!result) throw new Error("Failed to update profile");
        return this.findById(result.id);
    }

    async delete(id: string) {
        const [result] = await db.delete(profile).where(eq(profile.id, id)).returning();
        return result;
    }
}

export const profileRepository = new ProfileRepository();
