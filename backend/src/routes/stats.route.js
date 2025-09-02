import express from "express";
import authGuard from "../middleware/authGuard.js";
import {
  overview,
  last7DaysProduct,
  last7DaysInvoice,
  compareMonthData,
  top5products,
  chartStats,
} from "../controllers/statistics.controller.js";

const router = express.Router();

router.get("/", authGuard, chartStats);
router.get("/overview", authGuard, overview);
router.get("/last7days/product", authGuard, last7DaysProduct);
router.get("/last7days/invoice", authGuard,last7DaysInvoice);
router.get("/compare", authGuard, compareMonthData);
router.get("/top5products", authGuard, top5products);

export default router;
