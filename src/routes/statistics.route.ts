import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller.js";


const router = Router();

router.get("/dashboard/stats",getDashboardStats);

export default router;