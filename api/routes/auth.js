import express from "express";
import { googleUser, login,register, resendOtp, verifyOtp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google",googleUser);
router.post("/verifyOtp",verifyOtp);
router.post("/resendOtp",resendOtp);

export default router;