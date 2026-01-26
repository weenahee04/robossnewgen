import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { findTransactions } from '../database/memory-db.js';
import { generateId, calculateMemberTier } from '../utils/helpers.js';
import { Transaction, Notification } from '../types/index.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    let transactions = findTransactions(t => t.userId === req.userId);
    
    const start = Number(offset);
    const end = start + Number(limit);
    const paginatedTransactions = transactions.slice(start, end);

    const transactionsWithBranch = paginatedTransactions.map(t => {
      const branch = db.branches.get(t.branchId);
      return {
        ...t,
        branchName: branch?.name || 'Unknown'
      };
    });

    res.json(transactionsWithBranch);
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

    const pkg = db.packages.get(packageId);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const branch = db.branches.get(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const user = db.users.get(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactionId = generateId();
    const transaction: Transaction = {
      id: transactionId,
      userId: req.userId!,
      branchId,
      packageId,
      packageName: pkg.name,
      amount: pkg.price,
      pointsEarned: pkg.pointsReward,
      stampsEarned: pkg.stampsReward,
      status: 'completed',
      paymentMethod: paymentMethod || 'cash',
      createdAt: new Date().toISOString()
    };

    db.transactions.set(transactionId, transaction);

    const newPoints = user.points + pkg.pointsReward;
    const newStamps = user.currentStamps + pkg.stampsReward;
    const newTier = calculateMemberTier(newPoints);

    let finalStamps = newStamps;
    let bonusPoints = 0;

    if (newStamps >= user.totalStamps) {
      finalStamps = newStamps - user.totalStamps;
      bonusPoints = 100;
      
      const bonusNotification: Notification = {
        id: generateId(),
        userId: req.userId!,
        title: 'ครบสแตมป์แล้ว!',
        message: 'คุณได้รับโบนัส 100 แต้มจากการสะสมสแตมป์ครบ!',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.set(bonusNotification.id, bonusNotification);
    }

    user.points = newPoints + bonusPoints;
    user.currentStamps = finalStamps;
    user.memberTier = newTier;
    user.updatedAt = new Date().toISOString();
    db.users.set(req.userId!, user);

    const notification: Notification = {
      id: generateId(),
      userId: req.userId!,
      title: 'ได้รับแต้มแล้ว!',
      message: `คุณได้รับ ${pkg.pointsReward} แต้มจากการใช้บริการ ${pkg.name}`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notification.id, notification);

    const transactionWithBranch = {
      ...transaction,
      branchName: branch.name
    };

    res.status(201).json(transactionWithBranch);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const transaction = db.transactions.get(id);

    if (!transaction || transaction.userId !== req.userId) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const branch = db.branches.get(transaction.branchId);
    const transactionWithBranch = {
      ...transaction,
      branchName: branch?.name || 'Unknown'
    };

    res.json(transactionWithBranch);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

export default router;
