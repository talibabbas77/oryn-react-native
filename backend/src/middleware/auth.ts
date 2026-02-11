import type { Request, Response, NextFunction, RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../models/User.js";
import { requireAuth } from "@clerk/express";

export interface AuthRequest extends Request {
    userId?: string;
}

export const protectRoute: RequestHandler[] = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const {userId: clerkId} = getAuth(req);
            if (!clerkId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = await User.findOne({ clerkId });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            req.userId = user._id.toString();
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
]

declare module "express" {
    interface Request {
        userId?: string;
    }
}
