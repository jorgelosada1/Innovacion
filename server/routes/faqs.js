import express from 'express';
import Faq from '../models/Faq.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const faqs = await Faq.find().sort({ orden: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error in GET /faqs:', error.message);
    res.status(500).json({ error: 'Error al obtener FAQs' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    const faq = new Faq(data);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating faq:', error.message);
    res.status(400).json({ error: 'Error al crear pregunta: ' + error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;

    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json(faq);
  } catch (error) {
    console.error('Error updating faq:', error.message);
    res.status(400).json({ error: 'Error al actualizar pregunta: ' + error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting faq:', error.message);
    res.status(500).json({ error: 'Error al eliminar pregunta: ' + error.message });
  }
});

export default router;
