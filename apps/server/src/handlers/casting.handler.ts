import type { Context } from "hono";
import { castingService } from "../services/casting.service";
import { applicationService } from "../services/application.service";
import { successResponse, errorResponse } from "../lib/response";

export const getCastingsHandler = async (c: Context) => {
    try {
        const query = c.req.query();
        const queries = c.req.queries();

        const filters: any = { ...query };

        // Handle array parameters
        if (queries["skillIds[]"]) {
            filters.skillIds = queries["skillIds[]"];
        } else if (queries["skillIds"]) {
            filters.skillIds = queries["skillIds"];
        }

        // Parse numeric values
        if (filters.limit) filters.limit = Number(filters.limit);
        if (filters.offset) filters.offset = Number(filters.offset);
        if (filters.minBudget) filters.minBudget = Number(filters.minBudget);
        if (filters.maxBudget) filters.maxBudget = Number(filters.maxBudget);

        // Enforce published status for public listing unless otherwise specified
        const data = await castingService.getCastings({
            ...filters,
            status: filters.status || "published"
        });
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getMyCastingsHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const filters = c.req.query();

        console.log("My ID", user.id);

        // Force managerId to be the current user
        const data = await castingService.getCastings({ ...filters, managerId: user.id });
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getCastingHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await castingService.getCastingById(id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const createCastingHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await castingService.createCasting(user.id, body);
        return successResponse(c, data, "Casting created successfully", 201);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const updateCastingHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const body = await c.req.json();
        const data = await castingService.updateCasting(user.id, id, body);
        return successResponse(c, data, "Casting updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const deleteCastingHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const data = await castingService.deleteCasting(user.id, id);
        return successResponse(c, data, "Casting deleted successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getCategoriesHandler = async (c: Context) => {
    try {
        const data = await castingService.getCategories();
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getCastingApplicationsHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const data = await applicationService.getApplicationsByCastingId(user.id, id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
