import express from "express";
import {
  forgotPassword,
  login,
  logout,
  OTPVerification,
  RefreshToken,
  signup,
  updateForgottenPassword,
} from "../controllers/auth.controller.js";
import authGuard from "../middleware/authGuard.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authGuard, logout);
router.post("/forget-pass", forgotPassword);
router.post("/verify-otp", OTPVerification);
router.patch("/set-pass/:token", updateForgottenPassword);


router.get("/refresh", RefreshToken);

export default router;
