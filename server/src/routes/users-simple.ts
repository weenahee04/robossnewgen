import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { findTransactions } from '../database/memory-db.js';
import { calculateMemberTier } from '../utils/helpers.js';

const router = Router();

router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = db.users.get(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { name, phone } = req.body;
    const user = db.users.get(req.userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.phone = phone;
    user.updatedAt = new Date().toISOString();
    db.users.set(req.userId!, user);

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.get('/stats', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = db.users.get(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = findTransactions(t => t.userId === req.userId && t.status === 'completed');
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      points: user.points,
      currentStamps: user.currentStamps,
      totalStamps: user.totalStamps,
      memberTier: user.memberTier,
      totalWashes: transactions.length,
      totalSpent
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
