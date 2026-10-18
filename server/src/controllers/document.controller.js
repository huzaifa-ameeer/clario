import fs from "fs"
import Document from "../models/document.model.js"
import { analyzeText } from "../services/ai.service.js"
import { extractText } from "../utils/extractText.js"

const buildFileDetails = (file) => ({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size
})

export const uploadAndAnalyze = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    const filePath = req.file.path

    try {
        const text = await extractText(filePath, req.file.mimetype)

        if (!text || !text.trim()) {
            throw new Error("No extractable text found in the file")
        }

        const notes = await analyzeText(text)

        const document = await Document.create({
            user: req.user.id,
            ...buildFileDetails(req.file),
            notes,
            status: "completed"
        })

        return res.status(201).json({
            message: "File analyzed successfully",
            document: {
                id: document._id,
                originalName: document.originalName,
                size: document.size,
                status: document.status,
                notes: document.notes
            }
        })
    } catch (error) {
        await Document.create({
            user: req.user.id,
            ...buildFileDetails(req.file),
            notes: null,
            status: "failed"
        }).catch(() => {})

        return res.status(502).json({ message: "Failed to analyze file", error: error.message })
    } finally {
        await fs.promises.unlink(filePath).catch(() => {})
    }
}
