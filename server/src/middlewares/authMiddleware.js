import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user)
      return res.status(401).json({ error: 'User not found' });

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: 'Not authenticated' });

    if (roles.length > 0 && !roles.includes(req.user.role))
      return res.status(403).json({ error: 'Forbidden' });

    next();
  };
}
