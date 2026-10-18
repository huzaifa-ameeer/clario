import fs from "fs"
import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const extractPdfText = async (filePath) => {
    const buffer = await fs.promises.readFile(filePath)
    const parser = new PDFParse({ data: buffer })

    try {
        const result = await parser.getText()
        return result.text
    } finally {
        await parser.destroy().catch(() => {})
    }
}

export const extractText = async (filePath, mimeType) => {
    if (mimeType === "application/pdf") {
        return await extractPdfText(filePath)
    }

    if (mimeType === DOCX_MIME) {
        const { value } = await mammoth.extractRawText({ path: filePath })
        return value
    }

    throw new Error("Unsupported file type")
}
