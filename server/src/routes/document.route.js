import express from "express"
import { uploadAndAnalyze } from "../controllers/document.controller.js"
import protect from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.middleware.js"

const router = express.Router()

router.post("/analyze", protect, upload.single("file"), uploadAndAnalyze)

export default router
