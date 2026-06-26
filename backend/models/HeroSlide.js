import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    alt: { type: String, default: '', trim: true },
    focalX: { type: Number, default: 50, min: 0, max: 100 },
    focalY: { type: Number, default: 50, min: 0, max: 100 },
    kicker: { type: String, default: '', trim: true },
    /** Admin label / internal name — not shown in hero headline */
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    /** home | category slug (historical, adventure, …) */
    scope: { type: String, default: 'home', trim: true, index: true },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    scheduledStart: { type: Date, default: null },
    scheduledEnd: { type: Date, default: null },
  },
  { timestamps: true }
);

heroSlideSchema.index({ scope: 1, sortOrder: 1, createdAt: 1 });

export default mongoose.model('HeroSlide', heroSlideSchema);
