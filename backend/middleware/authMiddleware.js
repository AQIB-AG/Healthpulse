import jwt from 'jsonwebtoken';
import { Hospital } from '../models/Hospital.js';

export async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing.' });
    }

    const secret = process.env.JWT_SECRET || 'dev_healthpulse_secret';
    const payload = jwt.verify(token, secret);

    const hospital = await Hospital.findById(payload.sub).select('-password');
    if (!hospital) {
      return res.status(401).json({ message: 'Hospital not found.' });
    }

    req.user = {
      id: hospital._id.toString(),
      role: hospital.role,
      hospital,
    };

    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

