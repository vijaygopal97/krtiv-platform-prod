import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
  password: { type: String, required: false, minlength: 6 },
  phone: { type: String, trim: true },
  dob: { type: Date },
  interests: [{ type: String }],
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin', 'content_admin'],
    default: 'user',
  },
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true, trim: true },
  facebookId: { type: String, unique: true, sparse: true, trim: true },
  profilePicture: { type: String, default: '' },
  lastLoginAt: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

export default mongoose.model('User', userSchema);
