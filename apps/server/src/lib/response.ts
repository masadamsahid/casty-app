import type { Context } from "hono";

export type ApiResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        message: string;
        code?: string;
        errors?: Record<string, string[]>;
    };
};

export const sendResponse = (
    c: Context,
    status: number,
    success: boolean,
    message: string = "",
    data: any = null,
    error: any = null
) => {
    const body: ApiResponse = {
        success,
        message,
        data,
    };

    if (error) {
        body.error = error;
    }

    return c.json(body, status as any);
};

export const successResponse = (c: Context, data: any = null, message: string = "Success", status: number = 200) => {
    return sendResponse(c, status, true, message, data);
};

export const errorResponse = (c: Context, message: string, code: string = "INTERNAL_SERVER_ERROR", status: number = 500) => {
    return sendResponse(c, status, false, "", null, { message, code });
};

export const validationErrorResponse = (c: Context, errors: Record<string, string[]>, message: string = "Validation failed") => {
    return sendResponse(c, 400, false, "", null, {
        message,
        code: "VALIDATION_ERROR",
        errors,
    });
};
