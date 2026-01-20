import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import localesRoutes from './routes/locales';
import visitasRoutes from './routes/visitas';
import notasRoutes from './routes/notas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locales', localesRoutes);
app.use('/api/visitas', visitasRoutes);
app.use('/api/notas', notasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Panel admin: http://localhost:5173/admin`);
  console.log(`🔐 Usuario admin: soporte@niufoods.cl`);
});