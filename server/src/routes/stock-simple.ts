import { Router } from 'express';
import { randomUUID } from 'crypto';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import db, { findStockItems, findStockMovements } from '../database/memory-db.js';
import { StockItem, StockMovement } from '../types/index.js';

const router = Router();

// Get all stock items
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { category, lowStock, search } = req.query;
    
    let items = findStockItems(() => true);

    // Filter by category
    if (category) {
      items = items.filter(item => item.category === category);
    }

    // Filter low stock items
    if (lowStock === 'true') {
      items = items.filter(item => item.quantity <= item.minQuantity);
    }

    // Search by name
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm));
    }

    res.json(items);
  } catch (error) {
    console.error('Get stock items error:', error);
    res.status(500).json({ error: 'Failed to get stock items' });
  }
});

// Get stock item by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const item = db.stockItems.get(id);

    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    // Get movements for this item
    const movements = findStockMovements(m => m.stockItemId === id);

    res.json({
      ...item,
      movements
    });
  } catch (error) {
    console.error('Get stock item error:', error);
    res.status(500).json({ error: 'Failed to get stock item' });
  }
});

// Create new stock item
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { name, category, unit, quantity, minQuantity, maxQuantity, unitPrice, supplier, location } = req.body;

    if (!name || !category || !unit || quantity === undefined || !minQuantity || !maxQuantity || !unitPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem: StockItem = {
      id: randomUUID(),
      name,
      category,
      unit,
      quantity,
      minQuantity,
      maxQuantity,
      unitPrice,
      supplier,
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.stockItems.set(newItem.id, newItem);

    // Create initial stock movement
    const movement: StockMovement = {
      id: randomUUID(),
      stockItemId: newItem.id,
      type: 'in',
      quantity,
      previousQuantity: 0,
      newQuantity: quantity,
      reason: 'สร้างรายการสินค้าใหม่',
      userId: req.user!.id,
      createdAt: new Date().toISOString()
    };

    db.stockMovements.set(movement.id, movement);

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create stock item error:', error);
    res.status(500).json({ error: 'Failed to create stock item' });
  }
});

// Update stock item
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const item = db.stockItems.get(id);

    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    const { name, category, unit, minQuantity, maxQuantity, unitPrice, supplier, location } = req.body;

    const updatedItem: StockItem = {
      ...item,
      name: name || item.name,
      category: category || item.category,
      unit: unit || item.unit,
      minQuantity: minQuantity !== undefined ? minQuantity : item.minQuantity,
      maxQuantity: maxQuantity !== undefined ? maxQuantity : item.maxQuantity,
      unitPrice: unitPrice !== undefined ? unitPrice : item.unitPrice,
      supplier: supplier !== undefined ? supplier : item.supplier,
      location: location !== undefined ? location : item.location,
      updatedAt: new Date().toISOString()
    };

    db.stockItems.set(id, updatedItem);

    res.json(updatedItem);
  } catch (error) {
    console.error('Update stock item error:', error);
    res.status(500).json({ error: 'Failed to update stock item' });
  }
});

// Delete stock item
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const item = db.stockItems.get(id);

    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    db.stockItems.delete(id);

    res.json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    console.error('Delete stock item error:', error);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

// Stock In (รับสินค้าเข้า)
router.post('/:id/stock-in', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, branchId } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const item = db.stockItems.get(id);
    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    const previousQuantity = item.quantity;
    const newQuantity = previousQuantity + quantity;

    // Update stock item
    const updatedItem: StockItem = {
      ...item,
      quantity: newQuantity,
      lastRestockDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.stockItems.set(id, updatedItem);

    // Create stock movement
    const movement: StockMovement = {
      id: randomUUID(),
      stockItemId: id,
      type: 'in',
      quantity,
      previousQuantity,
      newQuantity,
      reason: reason || 'รับสินค้าเข้าคลัง',
      branchId,
      userId: req.user!.id,
      createdAt: new Date().toISOString()
    };

    db.stockMovements.set(movement.id, movement);

    res.json({
      item: updatedItem,
      movement
    });
  } catch (error) {
    console.error('Stock in error:', error);
    res.status(500).json({ error: 'Failed to stock in' });
  }
});

// Stock Out (เบิกสินค้าออก)
router.post('/:id/stock-out', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, branchId } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const item = db.stockItems.get(id);
    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const previousQuantity = item.quantity;
    const newQuantity = previousQuantity - quantity;

    // Update stock item
    const updatedItem: StockItem = {
      ...item,
      quantity: newQuantity,
      updatedAt: new Date().toISOString()
    };

    db.stockItems.set(id, updatedItem);

    // Create stock movement
    const movement: StockMovement = {
      id: randomUUID(),
      stockItemId: id,
      type: 'out',
      quantity,
      previousQuantity,
      newQuantity,
      reason: reason || 'เบิกสินค้าออก',
      branchId,
      userId: req.user!.id,
      createdAt: new Date().toISOString()
    };

    db.stockMovements.set(movement.id, movement);

    res.json({
      item: updatedItem,
      movement
    });
  } catch (error) {
    console.error('Stock out error:', error);
    res.status(500).json({ error: 'Failed to stock out' });
  }
});

// Adjust stock (ปรับปรุงสต็อก)
router.post('/:id/adjust', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { newQuantity, reason } = req.body;

    if (newQuantity === undefined || newQuantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const item = db.stockItems.get(id);
    if (!item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    const previousQuantity = item.quantity;
    const quantityDiff = newQuantity - previousQuantity;

    // Update stock item
    const updatedItem: StockItem = {
      ...item,
      quantity: newQuantity,
      updatedAt: new Date().toISOString()
    };

    db.stockItems.set(id, updatedItem);

    // Create stock movement
    const movement: StockMovement = {
      id: randomUUID(),
      stockItemId: id,
      type: 'adjustment',
      quantity: Math.abs(quantityDiff),
      previousQuantity,
      newQuantity,
      reason: reason || 'ปรับปรุงสต็อก',
      userId: req.user!.id,
      createdAt: new Date().toISOString()
    };

    db.stockMovements.set(movement.id, movement);

    res.json({
      item: updatedItem,
      movement
    });
  } catch (error) {
    console.error('Adjust stock error:', error);
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

// Get low stock items
router.get('/alerts/low-stock', authenticateToken, (req: AuthRequest, res) => {
  try {
    const lowStockItems = findStockItems(item => item.quantity <= item.minQuantity);

    res.json(lowStockItems);
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ error: 'Failed to get low stock items' });
  }
});

// Get stock movements
router.get('/movements/all', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { stockItemId, type, limit = 50 } = req.query;

    let movements = findStockMovements(() => true);

    if (stockItemId) {
      movements = movements.filter(m => m.stockItemId === stockItemId);
    }

    if (type) {
      movements = movements.filter(m => m.type === type);
    }

    movements = movements.slice(0, Number(limit));

    // Enrich with stock item names
    const enrichedMovements = movements.map(m => {
      const item = db.stockItems.get(m.stockItemId);
      return {
        ...m,
        stockItemName: item?.name || 'Unknown'
      };
    });

    res.json(enrichedMovements);
  } catch (error) {
    console.error('Get stock movements error:', error);
    res.status(500).json({ error: 'Failed to get stock movements' });
  }
});

// Get stock summary
router.get('/summary/stats', authenticateToken, (req: AuthRequest, res) => {
  try {
    const allItems = findStockItems(() => true);
    
    const totalItems = allItems.length;
    const lowStockItems = allItems.filter(item => item.quantity <= item.minQuantity).length;
    const outOfStockItems = allItems.filter(item => item.quantity === 0).length;
    const totalValue = allItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    // Category breakdown
    const categoryBreakdown = allItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, value: 0 };
      }
      acc[item.category].count += 1;
      acc[item.category].value += item.quantity * item.unitPrice;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    res.json({
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalValue,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Get stock summary error:', error);
    res.status(500).json({ error: 'Failed to get stock summary' });
  }
});

export default router;
