import 'dotenv/config';
import mongoose from 'mongoose';
import Journey from '../models/Journey.js';
import { getDefaultJourneys } from '../lib/journeyDefaults.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kraik';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const data of getDefaultJourneys()) {
    await Journey.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true });
    console.log('Upserted journey:', data.slug);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
