import express from 'express';
import Setting from '../models/Setting.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ error: 'No encontrado' });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

export default router;
