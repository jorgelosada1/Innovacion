import express from 'express';
import Noticia from '../models/Noticia.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const noticias = await Noticia.find().sort({ fecha: -1 });
    res.json(noticias);
  } catch (error) {
    console.error('Error in GET /noticias:', error.message);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json(noticia);
  } catch (error) {
    console.error('Error in GET /noticias/:id:', error.message);
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    const noticia = new Noticia(data);
    await noticia.save();
    res.status(201).json(noticia);
  } catch (error) {
    console.error('Error creating noticia:', error.message);
    res.status(400).json({ error: 'Error al crear noticia: ' + error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;

    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    console.error('Error updating noticia:', error.message);
    res.status(400).json({ error: 'Error al actualizar noticia: ' + error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting noticia:', error.message);
    res.status(500).json({ error: 'Error al eliminar noticia: ' + error.message });
  }
});

export default router;
