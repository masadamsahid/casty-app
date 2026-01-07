import type { Context } from "hono";
import { talentService } from "../services/talent.service";
import { successResponse, errorResponse } from "../lib/response";
import { z } from "zod";

const listTalentsSchema = z.object({
    name: z.string().optional(),
    agencyIds: z.preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.string())).optional(),
    skillIds: z.preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.string())).optional(),
    country: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    minAge: z.coerce.number().optional(),
    maxAge: z.coerce.number().optional(),
    minHeight: z.coerce.number().optional(),
    maxHeight: z.coerce.number().optional(),
    minWeight: z.coerce.number().optional(),
    maxWeight: z.coerce.number().optional(),
    minExperience: z.coerce.number().optional(),
    maxExperience: z.coerce.number().optional(),
    limit: z.coerce.number().default(20),
    offset: z.coerce.number().default(0),
    sortBy: z.enum(["age", "height", "weight", "experience"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const getTalentsHandler = async (c: Context) => {
    try {
        const query = c.req.query();
        // Hono's c.req.query() returns a flat object. 
        // We need to handle multi-value params if they are passed as individual params like ?skillIds=1&skillIds=2
        // However, Hono's c.req.query() only returns the first one.
        // For now, let's assume simple filtering or use c.req.queries() if multi-value is needed.
        const queries = c.req.queries();
        const consolidatedQuery = {
            ...query,
            skillIds: queries["skillIds[]"] || queries["skillIds"] || undefined,
            agencyIds: queries["agencyIds[]"] || queries["agencyIds"] || undefined,
        };

        const validatedQuery = listTalentsSchema.parse(consolidatedQuery);
        const data = await talentService.listTalents(validatedQuery);
        return successResponse(c, data);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return errorResponse(c, "Validation failed", "VALIDATION_ERROR", 400);
        }
        return errorResponse(c, error.message);
    }
};

export const getTalentHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await talentService.getTalent(id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
