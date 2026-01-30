import { Router } from 'express';
import { randomUUID } from 'crypto';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { getAllBranches } from '../database/memory-db.js';
import { Branch } from '../types/index.js';

const router = Router();

// Get all branches (for admin)
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const branches = getAllBranches();
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Failed to get branches' });
  }
});

// Get branch by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const branch = db.branches.get(id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Failed to get branch' });
  }
});

// Create new branch
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { name, address, lat, lng, image } = req.body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Name, address, lat, and lng are required' });
    }

    const branch: Branch = {
      id: randomUUID(),
      name,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status: 'Available',
      waitingCars: 0,
      image: image || 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString()
    };

    db.branches.set(branch.id, branch);

    res.status(201).json(branch);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Update branch
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const branch = db.branches.get(id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const { name, address, lat, lng, status, waitingCars, image } = req.body;

    const updatedBranch: Branch = {
      ...branch,
      ...(name && { name }),
      ...(address && { address }),
      ...(lat !== undefined && { lat: parseFloat(lat) }),
      ...(lng !== undefined && { lng: parseFloat(lng) }),
      ...(status && { status }),
      ...(waitingCars !== undefined && { waitingCars: parseInt(waitingCars) }),
      ...(image && { image })
    };

    db.branches.set(id, updatedBranch);

    res.json(updatedBranch);
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Delete branch
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const branch = db.branches.get(id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    db.branches.delete(id);

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

// Get branch statistics
router.get('/:id/stats', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const branch = db.branches.get(id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Get transactions for this branch
    const transactions = Array.from(db.transactions.values())
      .filter(t => t.branchId === id);

    const totalRevenue = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;
    const todayTransactions = transactions.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.createdAt).toDateString() === today;
    }).length;

    const stats = {
      branchId: id,
      branchName: branch.name,
      totalRevenue,
      totalTransactions,
      todayTransactions,
      waitingCars: branch.waitingCars,
      status: branch.status
    };

    res.json(stats);
  } catch (error) {
    console.error('Get branch stats error:', error);
    res.status(500).json({ error: 'Failed to get branch stats' });
  }
});

export default router;
