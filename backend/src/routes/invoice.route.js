import express from "express";
import authGuard from "../middleware/authGuard.js";
import {
  deleteInvoice,
  fetchInvoicesWithLimit,
  processInvoice,
  updateInvoiceStatus,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("", authGuard, fetchInvoicesWithLimit);

router.get("/process/:id", authGuard, processInvoice);
router.get("/update/:id", authGuard, updateInvoiceStatus);
router.delete("/delete/:id", authGuard, deleteInvoice);

export default router;
