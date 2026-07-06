import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, trim: true, index: true },
    section: { type: String, required: true, trim: true, default: 'main' },
    key: { type: String, required: true, trim: true },
    cmsKey: { type: String, required: true, unique: true, trim: true, index: true },
    value: { type: String, default: '' },
    valueType: {
      type: String,
      enum: ['text', 'html', 'json', 'image', 'seo'],
      default: 'text',
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

contentSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

export function buildCmsKey(page, section, key) {
  return `${page}.${section}.${key}`;
}

export default mongoose.model('Content', contentSchema);
