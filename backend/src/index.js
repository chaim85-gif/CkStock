import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/suppliers.js';
import priceRoutes from './routes/prices.js';
import { authenticate, tenantScope } from './middleware/auth.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// CORS — allow frontend dev server on localhost:5173
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication + tenant scope)
app.use('/api/products', authenticate, tenantScope, productRoutes);
app.use('/api/suppliers', authenticate, tenantScope, supplierRoutes);
app.use('/api/prices', authenticate, tenantScope, priceRoutes);

// Global error handler — NEVER expose technical details
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'הנתיב המבוקש לא נמצא' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CkStock API server running on http://0.0.0.0:${PORT}`);
});