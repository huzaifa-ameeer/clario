import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { sendOtpEmail } from "../utils/sendEmail.js"

const OTP_EXPIRY_MINUTES = 10

const clearAuthCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
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
        const user = await User.findById(req.user.id)

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        const hashedOtp = await bcrypt.hash(otp, 10)

        user.otp = hashedOtp
        user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        await user.save()

        await sendOtpEmail(user.email, user.name, otp)

        return res.status(200).json({ message: `OTP sent to your email, valid for ${OTP_EXPIRY_MINUTES} minutes` })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const resendOtp = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        const hashedOtp = await bcrypt.hash(otp, 10)

        user.otp = hashedOtp
        user.otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        await user.save()

        await sendOtpEmail(user.email, user.name, otp)

        return res.status(200).json({ message: `OTP resent to your email, valid for ${OTP_EXPIRY_MINUTES} minutes` })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { otp, newPassword } = req.body

        if (!otp || !newPassword) {
            return res.status(400).json({ message: "OTP and new password are required" })
        }

        const user = await User.findById(req.user.id)

        if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
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
