import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}

// Routes
import authRoutes from './routes/auth.js';
import noticiasRoutes from './routes/noticias.js';
import sliderRoutes from './routes/slider.js';
import cursosRoutes from './routes/cursos.js';
import faqsRoutes from './routes/faqs.js';
import commentsRoutes from './routes/comments.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── MongoDB Connection with Cache for Serverless ──
let isConnected = false;
export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGODB_URI || 
    'mongodb+srv://csugalan_db_user:rfnJJmRfRuRBk6xx@cluster0.85hfqb3.mongodb.net/Innovacion?retryWrites=true&w=majority';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ Conectado a MongoDB Atlas (SRV URI)');
  } catch (err) {
    console.warn('⚠️ Error SRV URI, probando URI directa:', err.message);
    const directUri = 'mongodb://csugalan_db_user:rfnJJmRfRuRBk6xx@ac-mbeiuwr-shard-00-00.85hfqb3.mongodb.net:27017,ac-mbeiuwr-shard-00-01.85hfqb3.mongodb.net:27017,ac-mbeiuwr-shard-00-02.85hfqb3.mongodb.net:27017/Innovacion?ssl=true&replicaSet=atlas-mbeiuwr-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ Conectado a MongoDB Atlas (Direct URI)');
  }
};

// ── Middleware ──
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to attempt DB connection without crashing if DB is warming up
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in middleware:', err.message);
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), dbConnected: mongoose.connection.readyState === 1 });
});

// Catch-all 404 for unmatched /api routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Ruta API no encontrada' });
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('Express Error Handler:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
