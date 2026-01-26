import { Router } from 'express';
import db from '../database/db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const packages = db.prepare(`
      SELECT * FROM wash_packages 
      WHERE isActive = 1 
      ORDER BY recommended DESC, price ASC
    `).all() as any[];

    packages.forEach(pkg => {
      if (pkg.features) {
        pkg.features = JSON.parse(pkg.features);
      }
    });

    res.json(packages);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Failed to get packages' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pkg = db.prepare('SELECT * FROM wash_packages WHERE id = ? AND isActive = 1').get(id) as any;

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    if (pkg.features) {
      pkg.features = JSON.parse(pkg.features);
    }

    res.json(pkg);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Failed to get package' });
  }
});

export default router;
