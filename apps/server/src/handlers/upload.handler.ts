import type { Context } from "hono";
import { uploadService } from "../services/upload.service";
import { successResponse, errorResponse } from "../lib/response";

export const uploadFileHandler = async (c: Context) => {
    try {
        const body = await c.req.parseBody();
        const file = body.file;

        if (!file || !(file instanceof File)) {
            return errorResponse(c, "No file uploaded", "BAD_REQUEST", 400);
        }

        const folder = (body.folder as string) || "general";
        const url = await uploadService.uploadFile(file, folder);

        return successResponse(c, { url }, "File uploaded successfully", 201);
    } catch (error: any) {
        return errorResponse(c, error.message);
    }
};
