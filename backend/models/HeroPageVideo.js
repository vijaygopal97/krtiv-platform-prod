import mongoose from 'mongoose';

const heroPageVideoSchema = new mongoose.Schema(
  {
    /** home | category slug | place:mumbai */
    scope: { type: String, required: true, unique: true, trim: true, index: true },
    /** CMS video path or URL; overrides default filename when set */
    videoUrl: { type: String, default: '', trim: true },
    /** Fallback banner when video missing or fails */
    posterUrl: { type: String, default: '', trim: true },
    /** When true, never play video — use slide/banner only */
    bannerOnly: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('HeroPageVideo', heroPageVideoSchema);
