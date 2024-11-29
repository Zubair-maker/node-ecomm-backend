import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  newUser,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new", newUser);

router.get("/all", isAdmin, getAllUsers);

// router.route("/:id").get(getUser).delete(deleteUser);
router.get("/:id", getUser);

router.delete("/:id", isAdmin, deleteUser);

export default router;
