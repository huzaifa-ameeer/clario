export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        return res.status(201).json({
            message: "File uploaded successfully",
            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                size: req.file.size,
                mimeType: req.file.mimetype,
                path: req.file.path
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
