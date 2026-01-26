import { Router } from 'express';
import { getAllPackages } from '../database/memory-db.js';
import db from '../database/memory-db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const packages = getAllPackages()
      .filter(p => p.isActive)
      .sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.price - b.price;
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
    const pkg = db.packages.get(id);

    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Failed to get package' });
  }
});

export default router;
