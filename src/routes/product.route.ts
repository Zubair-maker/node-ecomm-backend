import { Router } from "express";
import {
  deleteProduct,
  getAdminProduct,
  getAllCategoriesProduct,
  getLatestProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { singleUpload } from "../middlewares/multerMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/new", isAdmin, singleUpload, newProduct);

router.get("/latest", getLatestProduct);

router.get("/allcategories", getAllCategoriesProduct);

router.get("/admin-product", isAdmin, getAdminProduct);

router.get("/:id", getSingleProduct);

router.put("/:id", isAdmin, singleUpload, updateProduct);

router.get("/:id", isAdmin, deleteProduct);

export default router;
