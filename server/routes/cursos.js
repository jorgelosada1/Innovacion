import express from 'express';
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
    res.status(400).json({ error: 'Error al crear curso: ' + error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;

    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(curso);
  } catch (error) {
    console.error('Error updating curso:', error.message);
    res.status(400).json({ error: 'Error al actualizar curso: ' + error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting curso:', error.message);
    res.status(500).json({ error: 'Error al eliminar curso: ' + error.message });
  }
});

export default router;
