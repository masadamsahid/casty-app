import type { Context } from "hono";
import { userService } from "../services/user.service";
import { successResponse, errorResponse } from "../lib/response";

export const getMeHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const data = await userService.getUserProfile(user.id);
        return successResponse(c, data);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const updateProfileHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.updateProfile(user.id, body);
        return successResponse(c, data, "Profile updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

export const updateSettingsHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.updateUserSettings(user.id, body);
        return successResponse(c, data, "Settings updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
