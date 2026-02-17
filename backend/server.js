import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { ensureSeedData } from './services/seedService.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'healthpulse-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

async function start() {
  // Temporary debug log to confirm dotenv + MONGO_URI wiring.
  // eslint-disable-next-line no-console
  console.log('[Startup] MONGO_URI exists:', !!process.env.MONGO_URI);

  await connectDB();
  await ensureSeedData();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`HealthPulse API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

// NOTE: For MongoDB Atlas, ensure your current IP is allowed under
// "Network Access" in the Atlas console (or use "Allow Access from Anywhere" for dev only).

