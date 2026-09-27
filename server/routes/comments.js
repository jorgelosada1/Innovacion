import express from 'express';
import Comment from '../models/Comment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all comments (filtered by ?type=colaborador or ?type=testimonio)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const comments = await Comment.find(filter);
    res.json(comments);
  } catch (error) {
    console.error('Error in GET /comments:', error.message);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// POST new comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id; // Let schema auto-assign unique string ID
    const comment = new Comment(data);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(400).json({ error: 'Error al crear comentario: ' + error.message });
  }
});

// PUT update comment by ID (strict findByIdAndUpdate, no fallback creation, 404 if not found)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id; // Prevent updating primary key

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

// DELETE comment by ID (returns 404 if not found)
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
