import express from "express";
import { updateWidget, getWidget } from "../controllers/widget.controller.js";
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

router.put("/:userId", authGuard, updateWidget);
router.get("/:userId", authGuard, getWidget);

export default router;
