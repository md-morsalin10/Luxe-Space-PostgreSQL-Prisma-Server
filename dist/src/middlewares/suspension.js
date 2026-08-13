import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
export const checkSuspended = async (req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });
            if (session?.user && session.user.isSuspended === true) {
                res.status(403).json({
                    success: false,
                    message: "Your account is suspended. You cannot perform this action."
                });
                return;
            }
        }
        catch (error) {
            console.error("Error checking suspension status:", error);
        }
    }
    next();
};
