import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { getAuth, clerkClient } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function authCallback(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let user = await User.findOne({ clerkId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        avatar: clerkUser.imageUrl,
      });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in authCallback controller:", error);
    next(error);
  }
}
