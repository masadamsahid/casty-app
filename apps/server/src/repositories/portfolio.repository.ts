import { db, portfolio } from "@casty-app/db";
import { eq } from "drizzle-orm";

export class PortfolioRepository {
    async findById(id: string) {
        const [result] = await db.select().from(portfolio).where(eq(portfolio.id, id)).limit(1);
        return result;
    }

    async findByProfileId(profileId: string) {
        return await db.select().from(portfolio).where(eq(portfolio.profileId, profileId));
    }

    async create(data: typeof portfolio.$inferInsert) {
        const [result] = await db.insert(portfolio).values(data).returning();
        return result;
    }

    async update(id: string, data: Partial<typeof portfolio.$inferInsert>) {
        const [result] = await db.update(portfolio).set(data).where(eq(portfolio.id, id)).returning();
        return result;
    }

    async delete(id: string) {
        const [result] = await db.delete(portfolio).where(eq(portfolio.id, id)).returning();
        return result;
    }
}

export const portfolioRepository = new PortfolioRepository();
