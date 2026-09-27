import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'innovacion_elearning_jwt_secret_2026_secure';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;
