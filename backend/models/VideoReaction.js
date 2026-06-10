import mongoose from 'mongoose';

function normPath(p) {
  if (p == null || typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').replace(/^\/+/g, '').trim();
}

const videoReactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    threadId: { type: String, required: true, trim: true },
    videoPath: { type: String, required: true, trim: true },
    reaction: { type: String, enum: ['like', 'dislike'], required: true },
  },
  { timestamps: true }
);

videoReactionSchema.index({ userId: 1, threadId: 1, videoPath: 1 }, { unique: true });

videoReactionSchema.pre('validate', function (next) {
  if (this.videoPath) this.videoPath = normPath(this.videoPath);
  if (this.threadId) this.threadId = String(this.threadId).trim();
  next();
});

export default mongoose.models.VideoReaction || mongoose.model('VideoReaction', videoReactionSchema);
