import { db, casting, castingSkill, castingCategory } from "@casty-app/db";
import { eq, sql, and, inArray, ilike } from "drizzle-orm";

export class CastingRepository {
    async findAll(filters: any) {
        const { title, agencyId, categoryId, status, managerId, skillIds, location, sortBy, limit = 12, offset = 0 } = filters;

        const conditions = [];
        if (title) conditions.push(ilike(casting.title, `%${title}%`));
        if (location) conditions.push(ilike(casting.location, `%${location}%`));
        if (agencyId) conditions.push(eq(casting.agencyId, agencyId));
        if (categoryId) conditions.push(eq(casting.categoryId, categoryId));
        if (status) conditions.push(eq(casting.status, status));
        if (managerId) conditions.push(eq(casting.managerId, managerId));

        if (skillIds && skillIds.length > 0) {
            const castingIdsBySkill = await db
                .select({ castingId: castingSkill.castingId })
                .from(castingSkill)
                .where(inArray(castingSkill.skillId, skillIds))
                .groupBy(castingSkill.castingId);

            if (castingIdsBySkill.length === 0) return { data: [], total: 0 };
            conditions.push(inArray(casting.id, castingIdsBySkill.map(c => c.castingId)));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const data = await db.query.casting.findMany({
            where: whereClause,
            with: {
                agency: true,
                category: true,
                skills: {
                    with: {
                        skill: true,
                    }
                },
            },
            limit,
            offset,
            orderBy: (c, { desc, asc }) => {
                if (sortBy === "deadline") return [asc(c.deadline)];
                return [desc(c.createdAt)];
            },
        });

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(casting)
            .where(whereClause);

        return {
            data,
            total: Number(totalResult[0]?.count) || 0
        };
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

    async clearSkills(castingId: string): Promise<void> {
        await db.delete(castingSkill).where(eq(castingSkill.castingId, castingId));
    }
}

export const castingRepository = new CastingRepository();
