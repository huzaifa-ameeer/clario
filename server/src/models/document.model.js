import mongoose from "mongoose"

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    bullets: {
        type: [String],
        default: []
    }
}, { _id: false })

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true,
        enum: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
    },
    size: {
        type: Number,
        required: true
    },
    notes: {
        type: notesSchema,
        default: null
    },
    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing"
    }
}, { timestamps: true })

const Document = mongoose.model("Document", documentSchema)

export default Document
