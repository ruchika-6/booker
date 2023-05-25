import express from "express";
import { googleUser, login,register } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google",googleUser);

export default router;