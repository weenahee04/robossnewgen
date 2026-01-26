import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './database/seed-memory.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users-simple.js';
import branchRoutes from './routes/branches-simple.js';
import packageRoutes from './routes/packages-simple.js';
import vehicleRoutes from './routes/vehicles-simple.js';
import transactionRoutes from './routes/transactions-simple.js';
import rewardRoutes from './routes/rewards-simple.js';
import notificationRoutes from './routes/notifications-simple.js';
import qrRoutes from './routes/qr-simple.js';
import adminRoutes from './routes/admin-simple.js';
import stockRoutes from './routes/stock-simple.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Roboss API Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stock', stockRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚗 ROBOSS LOYALTY API SERVER                       ║
║                                                       ║
║   Server running on: http://localhost:${PORT}        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║   API Endpoints:                                      ║
║   - POST   /api/auth/register                        ║
║   - POST   /api/auth/login                           ║
║   - POST   /api/auth/demo-login                      ║
║   - GET    /api/users/me                             ║
║   - GET    /api/branches                             ║
║   - GET    /api/packages                             ║
║   - GET    /api/rewards                              ║
║   - POST   /api/transactions                         ║
║   - POST   /api/qr/generate                          ║
║   - GET    /api/admin/dashboard                      ║
║                                                       ║
║   Health Check: http://localhost:${PORT}/health      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
