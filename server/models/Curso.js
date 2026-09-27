import mongoose from 'mongoose';
const cursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, default: '' },
  videoId: { type: String, default: '' },
  duracion: { type: String, default: '' },
  nivel: { type: String, default: 'Básico' },
  temas: [{ type: String }],
  evaluacion: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Curso', cursoSchema);
