import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'guard', 'maintenance'], required: true },
  enrolledHostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', default: null },
});

const User = models.User || model('User', UserSchema);
export default User;
