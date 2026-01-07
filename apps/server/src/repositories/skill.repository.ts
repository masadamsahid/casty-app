import { db, skill } from "@casty-app/db";
import { ilike } from "drizzle-orm";

export class SkillRepository {
    async search(query: string) {
        return await db
            .select()
            .from(skill)
            .where(ilike(skill.name, `%${query}%`))
            .limit(20);
    }
}

export const skillRepository = new SkillRepository();
