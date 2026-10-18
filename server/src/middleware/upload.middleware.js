import fs from "fs"
import multer from "multer"
import path from "path"

const uploadDir = path.resolve("uploads")

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const allowedExtensions = [".pdf", ".docx"]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${uniqueSuffix}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()

    const isPdf = ext === ".pdf" && file.mimetype === "application/pdf"
    const isDocx =
        ext === ".docx" &&
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (isPdf || isDocx) {
        return cb(null, true)
    }

    cb(new Error("Only PDF and DOCX files are allowed"))
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload
