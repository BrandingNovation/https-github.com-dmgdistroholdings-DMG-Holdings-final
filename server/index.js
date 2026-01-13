import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import { siteDataRoutes } from './routes/siteData.js';
import { authRoutes } from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Large limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dmg_holdings',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Initialize database on startup
pool.on('connect', async () => {
  console.log('✓ Database connected');
  await initDatabase(pool);
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes(pool));
app.use('/api/site-data', siteDataRoutes(pool));

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});

export { pool };
