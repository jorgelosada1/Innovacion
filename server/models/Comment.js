import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  text: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  type: { type: String, enum: ['colaborador', 'testimonio'], required: true },
  university: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  color: { type: String, default: '#2E86C1' },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
