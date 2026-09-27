import express from 'express';
import Faq from '../models/Faq.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const defaultFaqs = [
  { _id: 'f1', question: '¿Los títulos son oficiales?', answer: 'Sí, todas nuestras universidades aliadas están avaladas por el Ministerio de Educación Nacional de Colombia. Los títulos tienen la misma validez que los presenciales.', orden: 0 },
  { _id: 'f2', question: '¿Cómo es el proceso de acompañamiento?', answer: 'Te asignamos un asesor personal que te guía desde la inscripción hasta la graduación. Tendrás soporte académico y administrativo durante toda tu carrera.', orden: 1 },
  { _id: 'f3', question: '¿Tiene algún costo la asesoría?', answer: 'No, nuestra asesoría es completamente gratuita. Te ayudamos a encontrar el programa perfecto para ti sin ningún compromiso.', orden: 2 },
  { _id: 'f4', question: '¿Qué necesito para inscribirme?', answer: 'Solo necesitas tu documento de identidad, diploma de bachiller (o acta de grado) y resultados del ICFES. Nosotros te guiamos en todo el proceso.', orden: 3 },
  { _id: 'f5', question: '¿Hay opciones de financiación?', answer: 'Sí, contamos con convenios con Icetex y las universidades ofrecen planes de pago flexibles. También hay becas y descuentos especiales.', orden: 4 },
];

router.get('/', async (_req, res) => {
  try {
    const faqs = await Faq.find().sort({ orden: 1 });
    if (!faqs || faqs.length === 0) return res.json(defaultFaqs);
    res.json(faqs);
  } catch (error) {
    console.error('Error in GET /faqs:', error.message);
    res.json(defaultFaqs);
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
