import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";


const router = Router();

router.get("/stats/dashboard",isAdmin, getDashboardStats);

export default router;