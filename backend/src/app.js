import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'CrisisSync AI API' });
});

app.use('/auth', authRoutes);
app.use('/incident', incidentRoutes);
app.use('/ai', aiRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/notifications', notificationRoutes);
app.use('/location', locationRoutes);
app.use('/audit', auditRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
