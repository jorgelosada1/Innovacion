import mongoose from 'mongoose';
const noticiaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  resumen: { type: String, default: '' },
  contenido: { type: String, default: '' }, // HTML from rich text editor
  fecha: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  imagen: { type: String, default: '' },
}, { timestamps: true });
export default mongoose.model('Noticia', noticiaSchema);
