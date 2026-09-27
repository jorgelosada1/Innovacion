import express from 'express';
import Comment from '../models/Comment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const defaultComments = [
  { _id: 'cm1', text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente en un ambiente de constante aprendizaje y colaboración.', name: 'Johan', role: 'Equipo Comercial', type: 'colaborador', photoUrl: '' },
  { _id: 'cm2', text: 'Me encanta la cultura de equipo que tenemos. Cada día es una oportunidad para innovar y aportar al cambio educativo en Colombia.', name: 'Paula', role: 'Área de Gestión', type: 'colaborador', photoUrl: '' },
  { _id: 'cm3', text: 'Aquí valoran nuestras ideas y nos dan las herramientas para hacer la diferencia en la educación superior del país.', name: 'Erika', role: 'Liderazgo Comercial', type: 'colaborador', photoUrl: '' },
  { _id: 'cm4', text: 'La atención y el acompañamiento fueron excepcionales durante todo mi proceso.', name: 'María Rodríguez', role: 'Estudiante de Administración', type: 'testimonio', university: 'Areandina', rating: 5, color: '#2E86C1' },
  { _id: 'cm5', text: 'Gracias a Innovación e-Learning pude acceder a educación virtual de calidad.', name: 'Carlos Mendoza', role: 'Estudiante de Ingeniería', type: 'testimonio', university: 'Iberoamericana', rating: 5, color: '#E74C3C' },
  { _id: 'cm6', text: 'El proceso fue muy sencillo y siempre tuve apoyo constante de mi asesor.', name: 'Ana López', role: 'Estudiante de Psicología', type: 'testimonio', university: 'Areandina', rating: 5, color: '#F39C12' },
];

// GET all comments (optionally filtered by ?type=colaborador or ?type=testimonio)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const comments = await Comment.find(filter);
    if (!comments || comments.length === 0) {
      const filtered = req.query.type ? defaultComments.filter(c => c.type === req.query.type) : defaultComments;
      return res.json(filtered);
    }
    res.json(comments);
  } catch (error) {
    console.error('Error in GET /comments:', error.message);
    const filtered = req.query.type ? defaultComments.filter(c => c.type === req.query.type) : defaultComments;
    res.json(filtered);
  }
});

// POST new comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id; // Let schema auto-assign a unique ID
    const comment = new Comment(data);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(400).json({ error: 'Error al crear comentario: ' + error.message });
  }
});

// PUT update existing comment by id (e.g. cm1, cm2, etc.)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id; // Prevent overwriting immutable primary key

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(400).json({ error: 'Error al actualizar comentario: ' + error.message });
  }
});

// DELETE comment by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Error al eliminar comentario: ' + error.message });
  }
});

export default router;
