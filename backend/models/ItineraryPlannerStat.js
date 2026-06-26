import mongoose from 'mongoose';

/** Rolling aggregates for admin analytics (keyword picks, generations). */
const itineraryPlannerStatSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    keywordCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    categoryKeywordCounts: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    generationsTotal: { type: Number, default: 0 },
    generationsByCategory: {
      type: Map,
      of: Number,
      default: {},
    },
    googleLoginsTotal: { type: Number, default: 0 },
    googleSignupsTotal: { type: Number, default: 0 },
    googleReturningLoginsTotal: { type: Number, default: 0 },
    lastGoogleLoginAt: { type: Date },
    passwordLoginsTotal: { type: Number, default: 0 },
    registeredUsersTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ItineraryPlannerStat ||
  mongoose.model('ItineraryPlannerStat', itineraryPlannerStatSchema);

export const PLANNER_STAT_KEY = 'global';
