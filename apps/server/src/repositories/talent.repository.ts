import { db, profile, user, profileSkill } from "@casty-app/db";
import { eq, and, like, ilike, sql, inArray, gte, lte } from "drizzle-orm";

export interface TalentFilters {
    name?: string;
    agencyIds?: string[];
    skillIds?: string[];
    country?: string;
    gender?: "male" | "female" | "other";
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    minWeight?: number;
    maxWeight?: number;
    minExperience?: number;
    maxExperience?: number;
    limit?: number;
    offset?: number;
    sortBy?: "age" | "height" | "weight" | "experience";
    sortOrder?: "asc" | "desc";
}

export class TalentRepository {
    async findAll(filters: TalentFilters) {
        const {
            name,
            skillIds,
            country,
            gender,
            minAge,
            maxAge,
            minHeight,
            maxHeight,
            minWeight,
            maxWeight,
            minExperience,
            maxExperience,
            limit = 20,
            offset = 0,
            sortBy,
            sortOrder = "desc",
        } = filters;

        const conditions = [];

        // Flag to only show users who are talents
        conditions.push(eq(user.isTalent, true));

        if (name) conditions.push(ilike(profile.fullName, `%${name}%`));
        if (country) conditions.push(ilike(profile.country, `%${country}%`));
        if (gender) conditions.push(eq(profile.gender, gender));
        if (minHeight) conditions.push(gte(profile.heightCm, minHeight));
        if (maxHeight) conditions.push(lte(profile.heightCm, maxHeight));
        if (minWeight) conditions.push(gte(profile.weightKg, minWeight));
        if (maxWeight) conditions.push(lte(profile.weightKg, maxWeight));
        if (minExperience) conditions.push(gte(profile.yearsOfExperience, minExperience));
        if (maxExperience) conditions.push(lte(profile.yearsOfExperience, maxExperience));

        if (skillIds && skillIds.length > 0) {
            const profileIdsBySkill = await db
                .select({ profileId: profileSkill.profileId })
                .from(profileSkill)
                .where(inArray(profileSkill.skillId, skillIds))
                .groupBy(profileSkill.profileId)
                .having(sql`count(${profileSkill.skillId}) = ${skillIds.length}`);

            if (profileIdsBySkill.length === 0) return { data: [], total: 0 };
            conditions.push(inArray(profile.id, profileIdsBySkill.map(p => p.profileId)));
        }

        if (minAge || maxAge) {
            const now = new Date();
            if (minAge) {
                const minBirthDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
                conditions.push(lte(profile.birthDate, minBirthDate.toISOString().split('T')[0]!));
            }
            if (maxAge) {
                const maxBirthDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
                conditions.push(gte(profile.birthDate, maxBirthDate.toISOString().split('T')[0]!));
            }
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get IDs for main query to support filtering across tables while using relational query builder
        const filteredProfiles = await db
            .select({ id: profile.id })
            .from(profile)
            .innerJoin(user, eq(profile.userId, user.id))
            .where(whereClause)
            .limit(limit)
            .offset(offset);

        if (filteredProfiles.length === 0) return { data: [], total: 0 };

        const talentIds = filteredProfiles.map(p => p.id);

        const data = await db.query.profile.findMany({
            where: inArray(profile.id, talentIds),
            with: {
                user: true,
                skills: { with: { skill: true } },
                galleryPhotos: { where: eq(sql`is_main`, true), limit: 1 },
            },
            orderBy: (p, { desc, asc }) => {
                const orderFunc = sortOrder === "asc" ? asc : desc;
                switch (sortBy) {
                    case "age": return [sortOrder === "asc" ? desc(p.birthDate) : asc(p.birthDate)];
                    case "height": return [orderFunc(p.heightCm)];
                    case "weight": return [orderFunc(p.weightKg)];
                    case "experience": return [orderFunc(p.yearsOfExperience)];
                    default: return [desc(p.createdAt)];
                }
            }
        });

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(profile)
            .innerJoin(user, eq(profile.userId, user.id))
            .where(whereClause);

        return { data, total: Number(totalResult[0]?.count) || 0 };
    }

    async findById(id: string) {
        return await db.query.profile.findFirst({
            where: eq(profile.id, id),
            with: {
                user: true,
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
}

export const talentRepository = new TalentRepository();
