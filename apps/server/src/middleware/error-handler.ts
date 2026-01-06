import type { Context } from "hono";
import { errorResponse } from "../lib/response";

export const errorHandler = async (err: Error, c: Context) => {
    console.error(`[Error] ${err.message}`, err.stack);

    // Handle specific errors if needed
    if (err.name === "ZodError") {
        // This could be handled here or in a separate validator middleware
        return errorResponse(c, "Validation failed", "VALIDATION_ERROR", 400);
    }

    return errorResponse(c, err.message || "An unexpected error occurred", "INTERNAL_SERVER_ERROR", 500);
};
