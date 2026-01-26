import { Router } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import db from '../database/db.js';
import { calculateDistance } from '../utils/helpers.js';

const router = Router();

router.get('/', optionalAuth, (req: AuthRequest, res) => {
  try {
    const { lat, lng } = req.query;
    
    const branches = db.prepare('SELECT * FROM branches ORDER BY name').all() as any[];

    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);

      branches.forEach(branch => {
        branch.distance = calculateDistance(userLat, userLng, branch.lat, branch.lng).toFixed(1) + ' km';
      });

      branches.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Failed to get branches' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const branch = db.prepare('SELECT * FROM branches WHERE id = ?').get(id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Failed to get branch' });
  }
});

export default router;
