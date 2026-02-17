import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Hospital } from '../models/Hospital.js';

const TOKEN_EXPIRY = '7d';

function signToken(hospitalId, role) {
  const secret = process.env.JWT_SECRET || 'dev_healthpulse_secret';
  return jwt.sign({ sub: hospitalId, role }, secret, { expiresIn: TOKEN_EXPIRY });
}

function sanitizeHospital(hospital) {
  const { password, __v, ...rest } = hospital.toObject();
  return rest;
}

export async function register(req, res, next) {
  try {
    const { name, email, password, region } = req.body;

    if (!name || !email || !password || !region) {
      return res.status(400).json({ message: 'Name, email, password and region are required.' });
    }

    const existing = await Hospital.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'A hospital with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const hospital = await Hospital.create({
      name,
      email,
      password: hashed,
      region,
    });

    const token = signToken(hospital._id.toString(), hospital.role);
    const safeHospital = sanitizeHospital(hospital);

    return res.status(201).json({ token, hospital: safeHospital });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const matches = await bcrypt.compare(password, hospital.password);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(hospital._id.toString(), hospital.role);
    const safeHospital = sanitizeHospital(hospital);

    return res.json({ token, hospital: safeHospital });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res) {
  if (!req.user?.hospital) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  return res.json({ hospital: req.user.hospital });
}

