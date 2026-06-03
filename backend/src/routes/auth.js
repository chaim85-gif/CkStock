import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates user and returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'נא להזין דוא"ל וסיסמה' });
    }

    const users = query(
      `SELECT id, email, password_hash, tenant_id, role FROM users WHERE email = '${email.replace(/'/g, "''")}'`
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'דוא"ל או סיסמה שגויים' });
    }

    const user = users[0];
    const isValid = bcrypt.compareSync(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'דוא"ל או סיסמה שגויים' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
      },
      process.env.JWT_SECRET || 'ckstock-dev-jwt-secret-2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

export default router;