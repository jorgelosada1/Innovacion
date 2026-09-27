import express from 'express';
import Slide from '../models/Slide.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const slides = await Slide.find().sort({ orden: 1 });
    res.json(slides);
  } catch (error) {
    console.error('Error in GET /slider:', error.message);
    res.status(500).json({ error: 'Error al obtener slider' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    const slide = new Slide(data);
    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating slide:', error.message);
    res.status(400).json({ error: 'Error al crear slide: ' + error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;

    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }

    res.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error.message);
    res.status(400).json({ error: 'Error al actualizar slide: ' + error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting slide:', error.message);
    res.status(500).json({ error: 'Error al eliminar slide: ' + error.message });
  }
});

export default router;
