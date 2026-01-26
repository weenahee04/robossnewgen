import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';
import { calculateMemberTier } from '../utils/helpers.js';

const router = Router();

router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, name, phone, points, currentStamps, totalStamps, memberTier, createdAt, updatedAt
      FROM users WHERE id = ?
    `).get(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { name, phone } = req.body;

    db.prepare(`
      UPDATE users SET name = ?, phone = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, phone, req.userId);

    const user = db.prepare(`
      SELECT id, email, name, phone, points, currentStamps, totalStamps, memberTier, createdAt, updatedAt
      FROM users WHERE id = ?
    `).get(req.userId);

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.get('/stats', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = db.prepare('SELECT points, currentStamps, totalStamps, memberTier FROM users WHERE id = ?').get(req.userId) as any;
    const totalWashes = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE userId = ? AND status = ?').get(req.userId, 'completed') as any;
    const totalSpent = db.prepare('SELECT SUM(amount) as total FROM transactions WHERE userId = ? AND status = ?').get(req.userId, 'completed') as any;

    res.json({
      points: user.points,
      currentStamps: user.currentStamps,
      totalStamps: user.totalStamps,
      memberTier: user.memberTier,
      totalWashes: totalWashes.count,
      totalSpent: totalSpent.total || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
