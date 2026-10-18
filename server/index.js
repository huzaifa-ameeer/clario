import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import connectDB from "./src/config/db.js"
import authRouter from "./src/routes/auth.route.js"
import uploadRouter from "./src/routes/upload.route.js"

const app = express()

dotenv.config()
await connectDB()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/files", uploadRouter)

app.use((error, req, res, next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large, max size is 5MB" })
    }
    if (error.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: "Server error", error: error.message })
})

const port = process.env.PORT

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`)
})