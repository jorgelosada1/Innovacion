import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'innovacion_elearning_jwt_secret_2026_secure';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const payload = { id: user._id, username: user.username, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: payload });
      }
    }
  } catch (error) {
    console.error('Login DB check error:', error.message);
  }

  // Fallback credentials check (innovacion / 0228)
  if (username === 'innovacion' && password === '0228') {
    const payload = { id: 'admin_fallback', username: 'innovacion', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: payload });
  }

  return res.status(401).json({ error: 'Credenciales inválidas' });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
    }
    res.json(user);
  } catch (error) {
    res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

      user.password = newPassword;
      await user.save();
      return res.json({ message: 'Contraseña actualizada correctamente' });
    }
  } catch (error) {
    console.error('Password change DB error:', error.message);
  }

  if (currentPassword === '0228') {
    // Upsert or create user in DB
    try {
      let u = await User.findOne({ username: 'innovacion' });
      if (!u) {
        u = new User({ username: 'innovacion', password: newPassword });
      } else {
        u.password = newPassword;
      }
      await u.save();
    } catch {}
    return res.json({ message: 'Contraseña actualizada correctamente' });
  }

  res.status(400).json({ error: 'Contraseña actual incorrecta' });
});

export default router;
