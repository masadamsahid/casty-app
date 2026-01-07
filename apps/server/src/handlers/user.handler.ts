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

// Experiences
export const addExperienceHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.addExperience(user.id, body);
        return successResponse(c, data, "Experience added successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const updateExperienceHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const data = await userService.updateExperience(id, body);
        return successResponse(c, data, "Experience updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const deleteExperienceHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await userService.deleteExperience(id);
        return successResponse(c, data, "Experience deleted successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

// Educations
export const addEducationHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.addEducation(user.id, body);
        return successResponse(c, data, "Education added successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const updateEducationHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const data = await userService.updateEducation(id, body);
        return successResponse(c, data, "Education updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const deleteEducationHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await userService.deleteEducation(id);
        return successResponse(c, data, "Education deleted successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

// Portfolios
export const addPortfolioHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.addPortfolio(user.id, body);
        return successResponse(c, data, "Portfolio added successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const updatePortfolioHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const data = await userService.updatePortfolio(id, body);
        return successResponse(c, data, "Portfolio updated successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const deletePortfolioHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await userService.deletePortfolio(id);
        return successResponse(c, data, "Portfolio deleted successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

// Gallery Photos
export const addGalleryPhotoHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.addGalleryPhoto(user.id, body);
        return successResponse(c, data, "Photo added successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const deleteGalleryPhotoHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const data = await userService.deleteGalleryPhoto(id);
        return successResponse(c, data, "Photo deleted successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const setMainGalleryPhotoHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const id = c.req.param("id");
        const data = await userService.setMainGalleryPhoto(id, user.id);
        return successResponse(c, data, "Main photo set successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};

// Skills
export const addSkillHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const data = await userService.addSkill(user.id, body.name);
        return successResponse(c, data, "Skill added successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
export const removeSkillHandler = async (c: Context) => {
    try {
        const user = c.get("user");
        const skillId = c.req.param("id");
        const data = await userService.removeSkill(user.id, skillId);
        return successResponse(c, data, "Skill removed successfully");
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
