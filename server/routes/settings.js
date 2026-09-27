import express from 'express';
import Setting from '../models/Setting.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      if (req.params.key === 'pin') {
        return res.json({ key: 'pin', value: '0228' });
      }
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error.message);
    if (req.params.key === 'pin') {
      return res.json({ key: 'pin', value: '0228' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error.message);
    res.status(400).json({ error: 'Error al actualizar configuración: ' + error.message });
  }
});

export default router;
