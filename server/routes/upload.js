import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';

// Memory storage: works 100% in Vercel Serverless (no disk writes needed)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.json({ url: base64 });
});

export default router;
