import 'dotenv/config';
import mongoose from 'mongoose';
import HeroSlide from '../models/HeroSlide.js';
import { allDefaultSlides } from '../routes/heroSlides.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kraik';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const deleted = await HeroSlide.deleteMany({});
  console.log('Removed', deleted.deletedCount, 'existing slides');

  const slides = allDefaultSlides();
  await HeroSlide.insertMany(slides);
  console.log('Seeded', slides.length, 'hero slides (home + all categories)');

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
