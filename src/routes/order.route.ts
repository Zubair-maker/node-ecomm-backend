import { Router } from "express";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrderStatus,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/new", newOrder);

router.get("/myorders", myOrders);

router.get("/allorders", isAdmin, getAllOrders);

router.get("/:id", getSingleOrder);

router.put("/:id", isAdmin, processOrderStatus);

router.delete("/:id", isAdmin, deleteOrder);

export default router;
