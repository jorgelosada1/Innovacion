import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    return candidate === this.password;
  }
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
