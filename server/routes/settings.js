import express from 'express';
import Setting from '../models/Setting.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const DEFAULTS = {
  pin: '0228',
};

router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      const defaultValue = DEFAULTS[req.params.key] || '';
      return res.json({ key: req.params.key, value: defaultValue });
    }
    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    const defaultValue = DEFAULTS[req.params.key] || '';
    res.json({ key: req.params.key, value: defaultValue });
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
    console.error('Error updating setting:', error);
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

export default router;
