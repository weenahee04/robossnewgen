import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';
import { generateId } from '../utils/helpers.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM rewards WHERE isActive = 1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY points ASC';

    const rewards = db.prepare(query).all(...params);
    res.json(rewards);
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
});

router.post('/redeem', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }

    const reward = db.prepare('SELECT * FROM rewards WHERE id = ? AND isActive = 1').get(rewardId) as any;
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ error: 'Reward out of stock' });
    }

    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId) as any;
    if (user.points < reward.points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const redemptionId = generateId();

    db.prepare(`
      INSERT INTO reward_redemptions (id, userId, rewardId, pointsUsed, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(redemptionId, req.userId, rewardId, reward.points, 'pending');

    db.prepare('UPDATE users SET points = points - ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run(reward.points, req.userId);

    db.prepare('UPDATE rewards SET stock = stock - 1 WHERE id = ?')
      .run(rewardId);

    db.prepare(`
      INSERT INTO notifications (id, userId, title, message, type, isRead)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.userId, 'แลกรางวัลสำเร็จ!', `คุณได้แลก ${reward.name} ด้วย ${reward.points} แต้ม`, 'success', 0);

    const redemption = db.prepare(`
      SELECT r.*, rw.name as rewardName, rw.description as rewardDescription
      FROM reward_redemptions r
      LEFT JOIN rewards rw ON r.rewardId = rw.id
      WHERE r.id = ?
    `).get(redemptionId);

    res.status(201).json(redemption);
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

router.get('/redemptions', authenticateToken, (req: AuthRequest, res) => {
  try {
    const redemptions = db.prepare(`
      SELECT r.*, rw.name as rewardName, rw.description as rewardDescription, rw.image as rewardImage
      FROM reward_redemptions r
      LEFT JOIN rewards rw ON r.rewardId = rw.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `).all(req.userId);

    res.json(redemptions);
  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json({ error: 'Failed to get redemptions' });
  }
});

export default router;
