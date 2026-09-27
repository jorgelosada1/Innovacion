import express from 'express';
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
