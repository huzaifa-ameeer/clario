import express from "express"
import { deleteDocument, getDocumentById, getMyDocuments, uploadAndAnalyze } from "../controllers/document.controller.js"
import protect from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.middleware.js"

const router = express.Router()

router.post("/analyze", protect, upload.single("file"), uploadAndAnalyze)
router.get("/", protect, getMyDocuments)
router.get("/:id", protect, getDocumentById)
router.delete("/:id", protect, deleteDocument)

export default router
