import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import connectDB from "./src/config/db.js"
import authRouter from "./src/routes/auth.route.js"
import documentRouter from "./src/routes/document.route.js"

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/auth", authRouter)
app.use("/api/documents", documentRouter)

app.use((error, req, res, next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large, max size is 5MB" })
    }
    if (error.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: "Server error", error: error.message })
})

await connectDB()

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})
