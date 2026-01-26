import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { unreadOnly } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params: any[] = [req.userId];

    if (unreadOnly === 'true') {
      query += ' AND isRead = 0';
    }

    query += ' ORDER BY createdAt DESC LIMIT 50';

    const notifications = db.prepare(query).all(...params);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

router.put('/:id/read', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND userId = ?').get(id, req.userId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(id);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.put('/read-all', authenticateToken, (req: AuthRequest, res) => {
  try {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE userId = ?').run(req.userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
