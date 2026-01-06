import { db, user } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class UserRepository {
    async findById(id: string) {
        const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);
        return result;
    }

    async findByEmail(email: string) {
        const [result] = await db.select().from(user).where(eq(user.email, email)).limit(1);
        return result;
    }

    async findByUsername(username: string) {
        const [result] = await db.select().from(user).where(eq(user.username, username)).limit(1);
        return result;
    }

    async update(id: string, data: Partial<typeof user.$inferInsert>) {
        const [result] = await db
            .update(user)
            .set(data)
            .where(eq(user.id, id))
            .returning();
        return result;
    }
}

export const userRepository = new UserRepository();
