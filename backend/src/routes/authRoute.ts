import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMe, authCallback } from "../controllers/authController.js";

const authRoutes: Router = Router();

authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/callback", protectRoute, authCallback);

export default authRoutes;