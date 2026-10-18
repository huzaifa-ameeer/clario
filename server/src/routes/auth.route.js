import express from "express"
import { forgetPassword, login, logout, register, resendOtp, verifyOtp } from "../controllers/auth.controller.js"
import protect from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forget-password", protect, forgetPassword)
router.post("/resend-otp", protect, resendOtp)
router.post("/verify-otp", protect, verifyOtp)

export default router
