import dotenv from "dotenv"
import express from "express"
import connectDB from "./src/config/db.js"

const app = express()

dotenv.config()
await connectDB()

const port = process.env.PORT

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`)
})