import mongoose from 'mongoose';

const { connection } = mongoose;

connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.log(`[MongoDB] Connected to database "${connection.name}"`);
});

connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[MongoDB] Connection error', err);
});

connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.warn('[MongoDB] Disconnected');
});

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    // eslint-disable-next-line no-console
    console.error('[MongoDB] MONGO_URI environment variable is not set. Aborting startup.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    // Successful connection is also logged via the "connected" event above.
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[MongoDB] Failed to connect during startup', err);
    process.exit(1);
  }
}


