import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  orden: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Faq', faqSchema);
