import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';
import { generateId, calculateMemberTier } from '../utils/helpers.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const transactions = db.prepare(`
      SELECT t.*, b.name as branchName
      FROM transactions t
      LEFT JOIN branches b ON t.branchId = b.id
      WHERE t.userId = ?
      ORDER BY t.createdAt DESC
      LIMIT ? OFFSET ?
    `).all(req.userId, Number(limit), Number(offset));

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { branchId, packageId, paymentMethod } = req.body;

    if (!branchId || !packageId) {
      return res.status(400).json({ error: 'Branch and package are required' });
    }

    const pkg = db.prepare('SELECT * FROM wash_packages WHERE id = ? AND isActive = 1').get(packageId) as any;
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const branch = db.prepare('SELECT * FROM branches WHERE id = ?').get(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const transactionId = generateId();

    db.prepare(`
      INSERT INTO transactions (id, userId, branchId, packageId, packageName, amount, pointsEarned, stampsEarned, status, paymentMethod)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      transactionId,
      req.userId,
      branchId,
      packageId,
      pkg.name,
      pkg.price,
      pkg.pointsReward,
      pkg.stampsReward,
      'completed',
      paymentMethod || 'cash'
    );

    const user = db.prepare('SELECT points, currentStamps, totalStamps FROM users WHERE id = ?').get(req.userId) as any;
    const newPoints = user.points + pkg.pointsReward;
    const newStamps = user.currentStamps + pkg.stampsReward;
    const newTier = calculateMemberTier(newPoints);

    let finalStamps = newStamps;
    let bonusPoints = 0;

    if (newStamps >= user.totalStamps) {
      finalStamps = newStamps - user.totalStamps;
      bonusPoints = 100;
      
      db.prepare(`
        INSERT INTO notifications (id, userId, title, message, type, isRead)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(generateId(), req.userId, 'ครบสแตมป์แล้ว!', 'คุณได้รับโบนัส 100 แต้มจากการสะสมสแตมป์ครบ!', 'success', 0);
    }

    db.prepare(`
      UPDATE users 
      SET points = ?, currentStamps = ?, memberTier = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newPoints + bonusPoints, finalStamps, newTier, req.userId);

    db.prepare(`
      INSERT INTO notifications (id, userId, title, message, type, isRead)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.userId, 'ได้รับแต้มแล้ว!', `คุณได้รับ ${pkg.pointsReward} แต้มจากการใช้บริการ ${pkg.name}`, 'success', 0);

    const transaction = db.prepare(`
      SELECT t.*, b.name as branchName
      FROM transactions t
      LEFT JOIN branches b ON t.branchId = b.id
      WHERE t.id = ?
    `).get(transactionId);

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const transaction = db.prepare(`
      SELECT t.*, b.name as branchName
      FROM transactions t
      LEFT JOIN branches b ON t.branchId = b.id
      WHERE t.id = ? AND t.userId = ?
    `).get(id, req.userId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

export default router;
