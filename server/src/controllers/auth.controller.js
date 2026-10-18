import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

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
