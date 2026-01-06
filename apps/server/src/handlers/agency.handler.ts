import type { Context } from "hono";
import { agencyService } from "../services/agency.service";
import { successResponse, errorResponse } from "../lib/response";

export const getAllAgenciesHandler = async (c: Context) => {
    try {
        const data = await agencyService.getAllAgencies();
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const getAgencyHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await agencyService.getAgencyById(id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const createAgencyHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await agencyService.createAgency(user.id, body);
        return successResponse(c, data, "Agency created successfully", 201);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const updateAgencyHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const body = await c.req.json();
        const data = await agencyService.updateAgency(user.id, id, body);
        return successResponse(c, data, "Agency updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const manageMembershipHandler = async (c: Context) => {
    try {
        const admin = c.get("user");
        const agencyId = c.req.param("id");
        const { userId, action, role } = await c.req.json();
        const data = await agencyService.manageMembership(admin.id, agencyId, userId, action, role);
        return successResponse(c, data, `Member ${action === "add" ? "added" : "removed"} successfully`);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
