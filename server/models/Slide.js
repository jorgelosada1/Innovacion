import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  imagen: { type: String, required: true },
  noticiaId: { type: String, default: '' },
  link: { type: String, default: '' },
  title: { type: String, default: '' },
  orden: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Slide', slideSchema);
