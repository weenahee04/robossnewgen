import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { findVehicles } from '../database/memory-db.js';
import { generateId } from '../utils/helpers.js';
import { Vehicle, Notification } from '../types/index.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const vehicles = findVehicles(v => v.userId === req.userId);
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
    const vehicle: Vehicle = {
      id: vehicleId,
      userId: req.userId!,
      make,
      model: model || '',
      licensePlate,
      createdAt: new Date().toISOString()
    };

    db.vehicles.set(vehicleId, vehicle);

    const notification: Notification = {
      id: generateId(),
      userId: req.userId!,
      title: 'ลงทะเบียนรถสำเร็จ',
      message: `คุณลงทะเบียนรถคันใหม่สำเร็จแล้ว (${licensePlate})`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notification.id, notification);

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const vehicle = db.vehicles.get(id);

    if (!vehicle || vehicle.userId !== req.userId) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    db.vehicles.delete(id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

export default router;
