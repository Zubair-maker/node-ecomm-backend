import { Router } from "express";
import {
  allCoupons,
  applyDiscount,
  createCoupen,
  deleteCoupon,
} from "../controllers/payment.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/discount", applyDiscount);

router.post("/create/coupon", isAdmin, createCoupen);

router.get("/all-coupons", allCoupons);

router.delete("/coupon/:id", isAdmin, deleteCoupon);

export default router;
