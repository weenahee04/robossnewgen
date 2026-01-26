import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';

const router = Router();

router.get('/dashboard', authenticateToken, (req: AuthRequest, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const todayRevenue = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE DATE(createdAt) = ? AND status = 'completed'
    `).get(today) as any;

    const newUsersToday = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE DATE(createdAt) = ?
    `).get(today) as any;

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;

    const activeBranches = db.prepare(`
      SELECT COUNT(*) as count 
      FROM branches 
      WHERE status != 'Closed'
    `).get() as any;

    const totalBranches = db.prepare('SELECT COUNT(*) as count FROM branches').get() as any;

    const recentTransactions = db.prepare(`
      SELECT t.*, u.name as userName, b.name as branchName
      FROM transactions t
      LEFT JOIN users u ON t.userId = u.id
      LEFT JOIN branches b ON t.branchId = b.id
      ORDER BY t.createdAt DESC
      LIMIT 10
    `).all();

    const branchStats = db.prepare(`
      SELECT 
        b.id,
        b.name,
        b.status,
        b.waitingCars,
        COALESCE(SUM(t.amount), 0) as revenue,
        COUNT(t.id) as transactionCount
      FROM branches b
      LEFT JOIN transactions t ON b.id = t.branchId AND DATE(t.createdAt) = ?
      GROUP BY b.id
      ORDER BY revenue DESC
    `).all(today);

    res.json({
      stats: {
        todayRevenue: todayRevenue.total,
        newUsersToday: newUsersToday.count,
        totalUsers: totalUsers.count,
        activeBranches: activeBranches.count,
        totalBranches: totalBranches.count
      },
      recentTransactions,
      branchStats
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

router.get('/users', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { search, tier, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT id, email, name, phone, points, currentStamps, memberTier, createdAt FROM users WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR id LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (tier) {
      query += ' AND memberTier = ?';
      params.push(tier);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const users = db.prepare(query).all(...params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

router.get('/analytics', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { days = 7 } = req.query;

    const revenueByDay = db.prepare(`
      SELECT 
        DATE(createdAt) as date,
        SUM(amount) as revenue,
        COUNT(*) as transactions
      FROM transactions
      WHERE DATE(createdAt) >= DATE('now', '-' || ? || ' days')
      AND status = 'completed'
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `).all(Number(days));

    const topPackages = db.prepare(`
      SELECT 
        packageName,
        COUNT(*) as count,
        SUM(amount) as revenue
      FROM transactions
      WHERE status = 'completed'
      GROUP BY packageName
      ORDER BY count DESC
      LIMIT 5
    `).all();

    const memberTierDistribution = db.prepare(`
      SELECT 
        memberTier,
        COUNT(*) as count
      FROM users
      GROUP BY memberTier
    `).all();

    res.json({
      revenueByDay,
      topPackages,
      memberTierDistribution
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
