import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { getAllRewards, findRedemptions } from '../database/memory-db.js';
import { generateId } from '../utils/helpers.js';
import { RewardRedemption, Notification } from '../types/index.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let rewards = getAllRewards().filter(r => r.isActive);

    if (category) {
      rewards = rewards.filter(r => r.category === category);
    }

    rewards.sort((a, b) => a.points - b.points);

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

    const reward = db.rewards.get(rewardId);
    if (!reward || !reward.isActive) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ error: 'Reward out of stock' });
    }

    const user = db.users.get(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.points < reward.points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const redemptionId = generateId();
    const redemption: RewardRedemption = {
      id: redemptionId,
      userId: req.userId!,
      rewardId,
      pointsUsed: reward.points,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.redemptions.set(redemptionId, redemption);

    user.points -= reward.points;
    user.updatedAt = new Date().toISOString();
    db.users.set(req.userId!, user);

    reward.stock -= 1;
    db.rewards.set(rewardId, reward);

    const notification: Notification = {
      id: generateId(),
      userId: req.userId!,
      title: 'แลกรางวัลสำเร็จ!',
      message: `คุณได้แลก ${reward.name} ด้วย ${reward.points} แต้ม`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notification.id, notification);

    const redemptionWithReward = {
      ...redemption,
      rewardName: reward.name,
      rewardDescription: reward.description
    };

    res.status(201).json(redemptionWithReward);
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

router.get('/redemptions', authenticateToken, (req: AuthRequest, res) => {
  try {
    const redemptions = findRedemptions(r => r.userId === req.userId);

    const redemptionsWithReward = redemptions.map(r => {
      const reward = db.rewards.get(r.rewardId);
      return {
        ...r,
        rewardName: reward?.name || 'Unknown',
        rewardDescription: reward?.description || '',
        rewardImage: reward?.image || ''
      };
    });

    res.json(redemptionsWithReward);
  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json({ error: 'Failed to get redemptions' });
  }
});

export default router;
