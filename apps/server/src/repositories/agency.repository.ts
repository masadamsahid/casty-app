import { db, agency, agencyMember } from "@casty-app/db";
import { eq, and } from "drizzle-orm";

export class AgencyRepository {
    async findAll() {
        return await db.query.agency.findMany({
            with: {
                members: true,
            }
        });
    }

    async findBySlug(slug: string) {
        return await db.query.agency.findFirst({
            where: eq(agency.slug, slug),
            with: {
                members: {
                    with: {
                        user: true,
                    }
                },
                castings: true,
            }
        });
    }

    async findById(id: string) {
        return await db.query.agency.findFirst({
            where: eq(agency.id, id),
            with: {
                members: {
                    with: {
                        user: true,
                    }
                },
                castings: true,
            }
        });
    }

    async create(data: typeof agency.$inferInsert) {
        const [result] = await db.insert(agency).values(data).returning();
        return result;
    }

    async update(id: string, data: Partial<typeof agency.$inferInsert>) {
        const [result] = await db.update(agency).set(data).where(eq(agency.id, id)).returning();
        return result;
    }

    async addMember(data: typeof agencyMember.$inferInsert) {
        const [result] = await db.insert(agencyMember).values(data).returning();
        return result;
    }

    async removeMember(agencyId: string, userId: string) {
        const [result] = await db.delete(agencyMember).where(and(eq(agencyMember.agencyId, agencyId), eq(agencyMember.userId, userId))).returning();
        return result;
    }

    async getMember(agencyId: string, userId: string) {
        return await db.query.agencyMember.findFirst({
            where: and(eq(agencyMember.agencyId, agencyId), eq(agencyMember.userId, userId)),
        });
    }
}

export const agencyRepository = new AgencyRepository();
