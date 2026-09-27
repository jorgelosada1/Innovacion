import express from 'express';
import mongoose from 'mongoose';
import Slide from '../models/Slide.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const defaultSlider = [
  { _id: 's1', imagen: '/src/assets/images/1.png', noticiaId: 'n1', title: 'Inscripciones Abiertas' },
  { _id: 's2', imagen: '/src/assets/images/2.png', noticiaId: 'n2', title: 'Educación Virtual' },
  { _id: 's3', imagen: '/src/assets/images/andina.png', link: '/universidades/areandina', title: 'Fundación Universitaria del Área Andina' },
  { _id: 's4', imagen: '/src/assets/images/ibero.png', link: '/universidades/iberoamericana', title: 'Corporación Universitaria Iberoamericana' },
];

router.get('/', async (_req, res) => {
  try {
    const slides = await Slide.find().sort({ orden: 1 });
    if (!slides || slides.length === 0) return res.json(defaultSlider);
    res.json(slides);
  } catch (error) {
    console.error('Error in GET /slider:', error.message);
    res.json(defaultSlider);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    if (data.noticiaId && !mongoose.Types.ObjectId.isValid(data.noticiaId)) {
      delete data.noticiaId;
    }
    const slide = new Slide(data);
    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating slide:', error.message);
    res.status(400).json({ error: 'Error al crear slide' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    if (data.noticiaId && !mongoose.Types.ObjectId.isValid(data.noticiaId)) {
      delete data.noticiaId;
    }
    let slide = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      slide = await Slide.findByIdAndUpdate(req.params.id, data, { new: true });
    }

    if (!slide) {
      slide = new Slide(data);
      await slide.save();
    }

    res.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error.message);
    res.status(400).json({ error: 'Error al actualizar slide' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Slide.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar slide' });
  }
});

export default router;
