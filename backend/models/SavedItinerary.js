import mongoose from 'mongoose';

const savedItinerarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    categoryFocus: { type: String, default: '', trim: true },
    categorySlug: { type: String, default: '', trim: true },
    keywords: { type: [String], default: [] },
    itineraryText: { type: String, required: true },
    parsedSummary: {
      theme: String,
      region: String,
      dayCount: Number,
    },
    source: { type: String, enum: ['smart-keywords', 'dashboard', 'import'], default: 'smart-keywords' },
    isFavorite: { type: Boolean, default: false, index: true },
    jobId: { type: String, default: '' },
  },
  { timestamps: true }
);

savedItinerarySchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.SavedItinerary ||
  mongoose.model('SavedItinerary', savedItinerarySchema);
