import express from 'express';
import mongoose from 'mongoose';
import Noticia from '../models/Noticia.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const defaultNoticias = [
  {
    _id: 'n1',
    titulo: 'Inscripciones Abiertas 2025-2',
    resumen: 'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
    contenido: '<p>Las inscripciones para el segundo semestre de 2025 ya están abiertas. Contamos con una amplia oferta de programas académicos en modalidad presencial y virtual, en alianza con la Fundación Universitaria del Área Andina y la Corporación Universitaria Iberoamericana. No pierdas la oportunidad de transformar tu futuro.</p>',
    fecha: '2025-07-01',
    imagen: '',
  },
  {
    _id: 'n2',
    titulo: 'Educación Virtual de Calidad',
    resumen: 'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
    contenido: '<p>Nuestra oferta de educación virtual te permite estudiar desde cualquier rincón de Colombia. Con plataformas modernas y un equipo de soporte dedicado, garantizamos una experiencia educativa de primer nivel.</p>',
    fecha: '2025-06-15',
    imagen: '',
  },
];

router.get('/', async (_req, res) => {
  try {
    const noticias = await Noticia.find().sort({ fecha: -1 });
    if (!noticias || noticias.length === 0) return res.json(defaultNoticias);
    res.json(noticias);
  } catch (error) {
    console.error('Error in GET /noticias:', error.message);
    res.json(defaultNoticias);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let noticia = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      noticia = await Noticia.findById(req.params.id);
    }
    if (!noticia) {
      const fallback = defaultNoticias.find(n => n._id === req.params.id) || defaultNoticias[0];
      return res.json(fallback);
    }
    res.json(noticia);
  } catch (error) {
    console.error('Error in GET /noticias/:id:', error.message);
    const fallback = defaultNoticias.find(n => n._id === req.params.id) || defaultNoticias[0];
    res.json(fallback);
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
    res.status(400).json({ error: 'Error al crear noticia' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    let noticia = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      noticia = await Noticia.findByIdAndUpdate(req.params.id, data, { new: true });
    }

    if (!noticia) {
      noticia = new Noticia(data);
      await noticia.save();
    }

    res.json(noticia);
  } catch (error) {
    console.error('Error updating noticia:', error.message);
    res.status(400).json({ error: 'Error al actualizar noticia' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Noticia.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

export default router;
