import mongoose from 'mongoose';

const contentHistorySchema = new mongoose.Schema(
  {
    cmsKey: { type: String, required: true, index: true },
    page: { type: String, required: true },
    section: { type: String, required: true },
    key: { type: String, required: true },
    previousValue: { type: String, default: '' },
    newValue: { type: String, default: '' },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editedByEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ContentHistory', contentHistorySchema);
