import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const checkSuspended = async (req: Request, res: Response, next: NextFunction) => {
    // ALWAYS allow auth routes through (sign-out, sign-in, etc.) — suspended
    // users must be able to log out at any time.
    if (req.path.startsWith('/api/auth')) {
        return next();
    }

    // Intercept data mutation requests only
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });
            
            // Check if the user is authenticated and suspended
            if (session?.user && (session.user as any).isSuspended === true) {
                res.status(403).json({ 
                    success: false, 
                    message: "Your account is suspended. You cannot perform this action." 
                });
                return;
            }
        } catch (error) {
            console.error("Error checking suspension status:", error);
        }
    }
    next();
};
