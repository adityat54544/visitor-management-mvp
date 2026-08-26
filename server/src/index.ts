import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  await connectDB();
  // Demo seeding only when explicitly enabled (never in production unless opted-in)
  if (process.env.ENABLE_DEMO_SEED === 'true') {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 API running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});