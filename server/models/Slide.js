import mongoose from 'mongoose';
const slideSchema = new mongoose.Schema({
  imagen: { type: String, required: true },
  noticiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Noticia', default: null },
  link: { type: String, default: '' },
  title: { type: String, default: '' },
  orden: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Slide', slideSchema);
