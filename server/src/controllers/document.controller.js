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

export const getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("originalName mimeType size notes status createdAt updatedAt")

        return res.status(200).json({
            message: "Document history fetched successfully",
            count: documents.length,
            documents
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user.id
        }).select("originalName mimeType size notes status createdAt updatedAt")

        if (!document) {
            return res.status(404).json({ message: "Document not found" })
        }

        return res.status(200).json({ document })
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Document not found" })
        }
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        })

        if (!document) {
            return res.status(404).json({ message: "Document not found" })
        }

        return res.status(200).json({ message: "Document deleted successfully" })
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Document not found" })
        }
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
