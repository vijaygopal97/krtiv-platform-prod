import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import HeroSlide from '../models/HeroSlide.js';
import { allDefaultSlides } from '../routes/heroSlides.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kraik';

const ADMIN = {
  name: 'KRTIV Admin',
  email: 'admin@krtiv.ai',
  phone: '9000000001',
  password: 'krtivadmin',
  role: 'admin',
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let admin = await User.findOne({ email: ADMIN.email });
  if (!admin) {
    admin = await User.create(ADMIN);
    console.log('Created admin user:', ADMIN.email);
  } else {
    admin.role = 'admin';
    admin.password = ADMIN.password;
    await admin.save();
    console.log('Updated admin user:', ADMIN.email);
  }

  const slideCount = await HeroSlide.countDocuments();
  if (slideCount === 0) {
    const slides = allDefaultSlides();
    await HeroSlide.insertMany(slides);
    console.log('Seeded', slides.length, 'hero slides');
  } else {
    console.log('Hero slides already exist:', slideCount);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
