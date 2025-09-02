import express from "express";
import authGuard from "../middleware/authGuard.js";
import { updateProfile } from "../controllers/admin.controller.js";

const router = express.Router();

router.patch("/update-profile", authGuard, updateProfile);

export default router