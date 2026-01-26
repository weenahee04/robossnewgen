import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import QRCode from 'qrcode';
import db from '../database/db.js';
import { generateId } from '../utils/helpers.js';

const router = Router();

router.post('/generate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId) as any;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const qrId = generateId();
    const code = `ROBOSS-${user.id}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO qr_codes (id, userId, code, expiresAt, isUsed)
      VALUES (?, ?, ?, ?, ?)
    `).run(qrId, user.id, code, expiresAt, 0);

    const qrDataUrl = await QRCode.toDataURL(code, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      id: qrId,
      code,
      qrImage: qrDataUrl,
      expiresAt,
      user: {
        id: user.id,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

router.post('/scan', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'QR code is required' });
    }

    const qrCode = db.prepare('SELECT * FROM qr_codes WHERE code = ?').get(code) as any;

    if (!qrCode) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    if (qrCode.isUsed) {
      return res.status(400).json({ error: 'QR code already used' });
    }

    if (new Date(qrCode.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'QR code expired' });
    }

    db.prepare('UPDATE qr_codes SET isUsed = 1 WHERE id = ?').run(qrCode.id);

    const user = db.prepare('SELECT id, name, email, points FROM users WHERE id = ?').get(qrCode.userId);

    res.json({
      success: true,
      user,
      message: 'QR code scanned successfully'
    });
  } catch (error) {
    console.error('Scan QR error:', error);
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
});

export default router;
