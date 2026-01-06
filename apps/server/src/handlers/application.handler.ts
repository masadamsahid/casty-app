import type { Context } from "hono";
import { applicationService } from "../services/application.service";
import { successResponse, errorResponse } from "../lib/response";

export const getMyApplicationsHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const data = await applicationService.getMyApplications(user.id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getApplicationHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await applicationService.getApplicationById(id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const applyCastingHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await applicationService.applyToCasting(user.id, body);
        return successResponse(c, data, "Applied successfully", 201);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const updateApplicationStatusHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const { status } = await c.req.json();
        const data = await applicationService.updateApplicationStatus(user.id, id, status);
        return successResponse(c, data, "Application status updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
