import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';
import { generateId } from '../utils/helpers.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const vehicles = db.prepare('SELECT * FROM vehicles WHERE userId = ? ORDER BY createdAt DESC').all(req.userId);
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to get vehicles' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { make, model, licensePlate } = req.body;

    if (!make || !licensePlate) {
      return res.status(400).json({ error: 'Make and license plate are required' });
    }

    const vehicleId = generateId();

    db.prepare(`
      INSERT INTO vehicles (id, userId, make, model, licensePlate)
      VALUES (?, ?, ?, ?, ?)
    `).run(vehicleId, req.userId, make, model || '', licensePlate);

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicleId);

    db.prepare(`
      INSERT INTO notifications (id, userId, title, message, type, isRead)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.userId, 'ลงทะเบียนรถสำเร็จ', `คุณลงทะเบียนรถคันใหม่สำเร็จแล้ว (${licensePlate})`, 'info', 0);

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND userId = ?').get(id, req.userId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export default router;
