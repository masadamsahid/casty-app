import { db, galleryPhoto } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class GalleryPhotoRepository {
    async findById(id: string) {
        const [result] = await db.select().from(galleryPhoto).where(eq(galleryPhoto.id, id)).limit(1);
        return result;
    }

    async findByProfileId(profileId: string) {
        return await db.select().from(galleryPhoto).where(eq(galleryPhoto.profileId, profileId));
    }

    async create(data: typeof galleryPhoto.$inferInsert) {
        const [result] = await db.insert(galleryPhoto).values(data).returning();
        return result;
    }

    async delete(id: string) {
        const [result] = await db.delete(galleryPhoto).where(eq(galleryPhoto.id, id)).returning();
        return result;
    }

    async setMain(id: string, profileId: string) {
        // Unset previous main
        await db.update(galleryPhoto).set({ isMain: false }).where(eq(galleryPhoto.profileId, profileId));
        // Set new main
        const [result] = await db.update(galleryPhoto).set({ isMain: true }).where(eq(galleryPhoto.id, id)).returning();
        return result;
    }
}

export const galleryPhotoRepository = new GalleryPhotoRepository();
