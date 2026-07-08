import mongoose from 'mongoose';

const listItemSchema = new mongoose.Schema(
  { label: String, detail: String },
  { _id: false }
);

const nearbySchema = new mongoose.Schema(
  { slug: String, title: String, image: String },
  { _id: false }
);

const mapSchema = new mongoose.Schema(
  { lat: Number, lng: Number, query: String },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    keywords: String,
    ogImage: String,
  },
  { _id: false }
);

const experienceBlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: String,
    heroImage: String,
    overview: String,
    whyVisit: String,
    bestTimeToVisit: String,
    thingsToDo: [listItemSchema],
    nearbyAttractions: [nearbySchema],
    howToReach: String,
    travelTips: [String],
    gallery: [String],
    map: mapSchema,
    relatedSlugs: [String],
    categoryTags: [String],
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seo: seoSchema,
  },
  { timestamps: true }
);

export default mongoose.models.ExperienceBlog ||
  mongoose.model('ExperienceBlog', experienceBlogSchema);
