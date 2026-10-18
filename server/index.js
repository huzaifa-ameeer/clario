import dotenv from "dotenv"
import express from "express"
import connectDB from "./src/config/db.js"
import authRouter from "./src/routes/auth.route.js"

const app = express()

dotenv.config()
await connectDB()

app.use(express.json())

app.use("/api/auth", authRouter)

const port = process.env.PORT

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`)
})