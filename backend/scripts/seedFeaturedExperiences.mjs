import 'dotenv/config';
import mongoose from 'mongoose';
import FeaturedCategory from '../models/FeaturedCategory.js';
import ExperienceBlog from '../models/ExperienceBlog.js';
import {
  getDefaultExperienceBlogs,
  getDefaultFeaturedCategories,
} from '../lib/featuredExperienceDefaults.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kraik';

async function main() {
  await mongoose.connect(MONGODB_URI);
  for (const data of getDefaultExperienceBlogs()) {
    await ExperienceBlog.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true });
    console.log('Blog:', data.slug);
  }
  for (const data of getDefaultFeaturedCategories()) {
    await FeaturedCategory.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true });
    console.log('Category:', data.slug);
  }
  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
