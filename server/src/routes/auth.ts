import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { findUser } from '../database/memory-db.js';
import { generateUserId, generateId } from '../utils/helpers.js';
import { User, Notification } from '../types/index.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = findUser(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();

    const newUser: User = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      phone: phone || undefined,
      points: 0,
      currentStamps: 0,
      totalStamps: 10,
      memberTier: 'Silver',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.set(userId, newUser);

    const notification: Notification = {
      id: generateId(),
      userId,
      title: 'ยินดีต้อนรับ!',
      message: 'ขอบคุณที่เข้าร่วมเป็นสมาชิก Roboss ล้างรถครั้งแรกรับ 50 แต้มฟรี!',
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notification.id, notification);

    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    const { password: _, ...user } = newUser;

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = findUser(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/demo-login', async (req, res) => {
  try {
    const demoUser = db.users.get('ROBOSS-9921');
    
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found' });
    }

    const token = jwt.sign(
      { id: demoUser.id, email: demoUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        phone: demoUser.phone,
        points: demoUser.points,
        currentStamps: demoUser.currentStamps,
        totalStamps: demoUser.totalStamps,
        memberTier: demoUser.memberTier
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

router.post('/line-login', async (req, res) => {
  try {
    const { lineUserId, displayName, pictureUrl } = req.body;

    if (!lineUserId || !displayName) {
      return res.status(400).json({ error: 'LINE user ID and display name are required' });
    }

    let user = findUser(u => u.email === `line_${lineUserId}@roboss.com`);

    if (!user) {
      const userId = `ROBOSS-${Math.floor(1000 + Math.random() * 9000)}`;
      user = {
        id: userId,
        email: `line_${lineUserId}@roboss.com`,
        password: await bcrypt.hash(Math.random().toString(36).substr(2, 9), 10),
        name: displayName,
        phone: '',
        points: 0,
        currentStamps: 0,
        totalStamps: 10,
        memberTier: 'Silver',
        lineUserId,
        pictureUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.set(user.id, user);

      const welcomeNotification = {
        id: generateId(),
        userId: user.id,
        title: 'ยินดีต้อนรับสู่ ROBOSS!',
        message: `สวัสดี ${displayName}! ขอบคุณที่เข้าร่วมโปรแกรม ROBOSS Loyalty`,
        type: 'info' as const,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.set(welcomeNotification.id, welcomeNotification);
    } else {
      user.name = displayName;
      user.pictureUrl = pictureUrl;
      user.updatedAt = new Date().toISOString();
      db.users.set(user.id, user);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        points: user.points,
        currentStamps: user.currentStamps,
        totalStamps: user.totalStamps,
        memberTier: user.memberTier,
        lineUserId: user.lineUserId,
        pictureUrl: user.pictureUrl
      }
    });
  } catch (error) {
    console.error('LINE login error:', error);
    res.status(500).json({ error: 'LINE login failed' });
  }
});

export default router;
