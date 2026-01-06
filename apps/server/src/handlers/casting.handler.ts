import type { Context } from "hono";
import { castingService } from "../services/casting.service";
import { successResponse, errorResponse } from "../lib/response";

export const getCastingsHandler = async (c: Context) => {
    try {
        const filters = c.req.query();
        const data = await castingService.getCastings(filters);
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
