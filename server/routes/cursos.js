import express from 'express';
import mongoose from 'mongoose';
import Curso from '../models/Curso.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const defaultCursos = [
  {
    _id: 'c1',
    titulo: 'Liderazgo Efectivo',
    descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
    videoId: 'jS3c8ZoxAgE',
    duracion: '4 semanas',
    nivel: 'Intermedio',
    temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
    evaluacion: true,
  },
];

router.get('/', async (_req, res) => {
  try {
    const cursos = await Curso.find();
    if (!cursos || cursos.length === 0) return res.json(defaultCursos);
    res.json(cursos);
  } catch (error) {
    console.error('Error in GET /cursos:', error.message);
    res.json(defaultCursos);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    const curso = new Curso(data);
    await curso.save();
    res.status(201).json(curso);
  } catch (error) {
    console.error('Error creating curso:', error.message);
    res.status(400).json({ error: 'Error al crear curso' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    let curso = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      curso = await Curso.findByIdAndUpdate(req.params.id, data, { new: true });
    }

    if (!curso) {
      curso = new Curso(data);
      await curso.save();
    }

    res.json(curso);
  } catch (error) {
    console.error('Error updating curso:', error.message);
    res.status(400).json({ error: 'Error al actualizar curso' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Curso.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
});

export default router;
