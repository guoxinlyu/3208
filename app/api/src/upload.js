// api/src/upload.js
// AI assistance: ChatGPT (GPT-5 Thinking) used on 2025-10-22 to review multer memory storage limits,
// GCS object naming strategy (date + uuid), Cache-Control best practice, and basic MIME allowlist.
import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import { Storage } from '@google-cloud/storage'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB
const storage = new Storage()
const bucketName = process.env.BUCKET_NAME
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' })
        if (!ALLOWED.has(req.file.mimetype)) return res.status(400).json({ error: 'Invalid type' })

        const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }[req.file.mimetype] || 'bin'
        const objectName = `posts/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`
        const file = storage.bucket(bucketName).file(objectName)

        await file.save(req.file.buffer, {
            contentType: req.file.mimetype,
            resumable: false,
            public: true,
            metadata: { cacheControl: 'public, max-age=31536000, immutable' },
        })

        const url = `https://storage.googleapis.com/${bucketName}/${objectName}`
        res.json({ url })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Upload failed' })
    }
})

export default router
