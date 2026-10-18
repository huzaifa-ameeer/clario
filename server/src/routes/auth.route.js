import express from "express"
import { forgetPassword, login, logout, register, resendOtp, verifyOtp } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forget-password", forgetPassword)
router.post("/resend-otp", resendOtp)
router.post("/verify-otp", verifyOtp)

export default router
