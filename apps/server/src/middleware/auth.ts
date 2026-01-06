import { auth } from "@casty-app/auth";
import type { Context, Next } from "hono";
import { errorResponse } from "../lib/response";

export const authMiddleware = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return errorResponse(c, "Unauthorized", "UNAUTHORIZED", 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);

    await next();
};
