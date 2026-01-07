import { db, casting, castingSkill, castingCategory } from "@casty-app/db";
import { eq, and, like, sql } from "drizzle-orm";

export class CastingRepository {
    async findAll(filters: any) {
        const { title, agencyId, categoryId, status, managerId } = filters;
        const conditions = [];

        if (title) conditions.push(like(casting.title, `%${title}%`));
        if (agencyId) conditions.push(eq(casting.agencyId, agencyId));
        if (categoryId) conditions.push(eq(casting.categoryId, categoryId));
        if (status) conditions.push(eq(casting.status, status));
        if (managerId) conditions.push(eq(casting.managerId, managerId));

        return await db.query.casting.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                agency: true,
                category: true,
                skills: {
                    with: {
                        skill: true,
                    }
                },
            },
            orderBy: (c, { desc }) => [desc(c.createdAt)],
        });
    }

    async findById(id: string) {
        return await db.query.casting.findFirst({
            where: eq(casting.id, id),
            with: {
                agency: true,
                category: true,
                skills: {
                    with: {
                        skill: true,
                    }
                },
                manager: true,
            }
        });
    }

    async create(data: typeof casting.$inferInsert) {
        const [result] = await db.insert(casting).values(data).returning();
        return result;
    }

    async update(id: string, data: Partial<typeof casting.$inferInsert>) {
        const [result] = await db.update(casting).set(data).where(eq(casting.id, id)).returning();
        return result;
    }

    async delete(id: string) {
        const [result] = await db.delete(casting).where(eq(casting.id, id)).returning();
        return result;
    }

    async findCategories() {
        return await db.select().from(castingCategory);
    }

    async createCategory(name: string) {
        const [result] = await db.insert(castingCategory).values({ id: sql`gen_random_uuid()::text`, name }).onConflictDoNothing().returning();
        if (!result) {
            return await db.query.castingCategory.findFirst({ where: eq(castingCategory.name, name) });
        }
        return result;
    }

    async addSkillPreference(castingId: string, skillId: string) {
        return await db.insert(castingSkill).values({ castingId, skillId }).onConflictDoNothing().returning();
    }

    async clearSkills(castingId: string) {
        return await db.delete(castingSkill).where(eq(castingSkill.castingId, castingId));
    }
}

export const castingRepository = new CastingRepository();
