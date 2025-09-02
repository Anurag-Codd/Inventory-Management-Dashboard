import express from "express";
import {
  addMultipleProducts,
  addSingleProduct,
  fetchProductWithLimit,
  searchProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import authGuard from "../middleware/authGuard.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/search", authGuard, searchProduct);
router.get("", authGuard, fetchProductWithLimit);
router.post(
  "/single",
  authGuard,
  upload.single("image"),
  addSingleProduct
);
router.post("/multi",authGuard, upload.single('file'),addMultipleProducts);
router.put("/update/:productId", authGuard, updateProduct);

export default router;
