import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import visitorRoutes from './routes/visitor.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// REST routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);