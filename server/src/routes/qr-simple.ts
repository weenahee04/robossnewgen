import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import QRCode from 'qrcode';
import db, { findQRCode } from '../database/memory-db.js';
import { generateId } from '../utils/helpers.js';
import { QRCode as QRCodeType } from '../types/index.js';

const router = Router();

router.post('/generate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = db.users.get(req.userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const qrId = generateId();
    const code = `ROBOSS-${user.id}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const qrCode: QRCodeType = {
      id: qrId,
      userId: user.id,
      code,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    db.qrCodes.set(qrId, qrCode);

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

    const qrCode = findQRCode(qr => qr.code === code);

    if (!qrCode) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    if (qrCode.isUsed) {
      return res.status(400).json({ error: 'QR code already used' });
    }

    if (new Date(qrCode.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'QR code expired' });
    }

    qrCode.isUsed = true;
    db.qrCodes.set(qrCode.id, qrCode);

    const user = db.users.get(qrCode.userId);

    res.json({
      success: true,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points
      } : null,
      message: 'QR code scanned successfully'
    });
  } catch (error) {
    console.error('Scan QR error:', error);
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
});

export default router;
