import mongoose from 'mongoose';

const listItemSchema = new mongoose.Schema(
  { label: String, detail: String, icon: String },
  { _id: false }
);

const itineraryStepSchema = new mongoose.Schema(
  { time: String, title: String, description: String },
  { _id: false }
);

const nearbySchema = new mongoose.Schema(
  { slug: String, title: String, image: String, region: String },
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

const travelInfoSchema = new mongoose.Schema(
  {
    location: String,
    nearestAirport: String,
    nearestRailway: String,
    roadConnectivity: String,
    entryFees: String,
    timings: String,
    duration: String,
    difficulty: String,
    bestSeason: String,
    idealFor: String,
  },
  { _id: false }
);

const mapSchema = new mongoose.Schema(
  { lat: Number, lng: Number, query: String },
  { _id: false }
);

const journeySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: String,
    location: String,
    category: String,
    readingTime: String,
    shortDescription: String,
    heroImage: String,
    region: String,
    blurb: String,
    cardLayout: { type: String, enum: ['featured', 'compact'], default: 'compact' },
    sortOrder: { type: Number, default: 0 },
    story: String,
    storySections: [
      {
        heading: String,
        paragraphs: [String],
      },
    ],
    highlights: [listItemSchema],
    gallery: [String],
    experiences: [listItemSchema],
    itinerary: [itineraryStepSchema],
    travelInfo: travelInfoSchema,
    localFood: [String],
    travelTips: [String],
    nearby: [nearbySchema],
    map: mapSchema,
    seo: seoSchema,
  },
  { timestamps: true }
);

export default mongoose.model('Journey', journeySchema);
