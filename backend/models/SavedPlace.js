import mongoose from 'mongoose';

const savedPlaceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    locationLabel: { type: String, default: '', trim: true },
    source: { type: String, default: '', trim: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

savedPlaceSchema.index({ userId: 1, slug: 1 }, { unique: true });
savedPlaceSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.SavedPlace || mongoose.model('SavedPlace', savedPlaceSchema);
