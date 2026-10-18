import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { randomInt } from "node:crypto"
import User from "../models/user.model.js"
import { sendOtpEmail } from "../utils/sendEmail.js"

const OTP_EXPIRY_MINUTES = 10
const PASSWORD_RESET_MESSAGE = "If an account exists for that email, an OTP has been sent"

const isProduction =
    process.env.NODE_ENV === "production" ||
    (process.env.CLIENT_URL || "").startsWith("https://")

const clearAuthCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict"
    })
}

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const register = async (req, res) => {
    try {
        const { name, email, password, occupation } = req.body

        if (!name || !email || !password || !occupation) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            occupation
        })

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                occupation: user.occupation,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = generateToken(user._id)
        setTokenCookie(res, token)

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                occupation: user.occupation,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        clearAuthCookie(res)

        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (user) {
            const otp = randomInt(1000, 10000).toString()
            user.otp = await bcrypt.hash(otp, 10)
            user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
            await user.save()
            await sendOtpEmail(user.email, user.name, otp)
        }

        return res.status(200).json({ message: PASSWORD_RESET_MESSAGE })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (user) {
            const otp = randomInt(1000, 10000).toString()
            user.otp = await bcrypt.hash(otp, 10)
            user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
            await user.save()
            await sendOtpEmail(user.email, user.name, otp)
        }

        return res.status(200).json({ message: PASSWORD_RESET_MESSAGE })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof otp !== "string" ||
            !/^\d{4}$/.test(otp) ||
            typeof newPassword !== "string" ||
            !newPassword
        ) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" })
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (!user || !user.otp || !user.otpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired, please request a new one" })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if (isSamePassword) {
            return res.status(400).json({ message: "New password must be different from the current password" })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.otp = undefined
        user.otpExpires = undefined
        await user.save()

        clearAuthCookie(res)

        return res.status(200).json({ message: "Password reset successfully, please login again" })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
