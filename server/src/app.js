import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// health check endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// global error handler
app.use(errorHandler);

export default app;



