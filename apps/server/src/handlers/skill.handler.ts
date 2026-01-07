import type { Context } from "hono";
import { skillRepository } from "../repositories/skill.repository";
import { successResponse, errorResponse } from "../lib/response";

export const searchSkillsHandler = async (c: Context) => {
    try {
        const query = c.req.query("q") || "";
        const data = await skillRepository.search(query);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
