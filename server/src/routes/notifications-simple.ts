import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { findNotifications } from '../database/memory-db.js';
import db from '../database/memory-db.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { unreadOnly } = req.query;
    
    let notifications = findNotifications(n => n.userId === req.userId);

    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.isRead);
    }

    const limited = notifications.slice(0, 50);
    res.json(limited);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

router.put('/:id/read', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const notification = db.notifications.get(id);

    if (!notification || notification.userId !== req.userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    db.notifications.set(id, notification);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.put('/read-all', authenticateToken, (req: AuthRequest, res) => {
  try {
    const notifications = findNotifications(n => n.userId === req.userId);
    
    notifications.forEach(n => {
      n.isRead = true;
      db.notifications.set(n.id, n);
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
