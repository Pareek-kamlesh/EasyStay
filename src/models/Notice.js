import mongoose, { Schema, model, models } from 'mongoose';

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true }, // Title of the notice
    content: { type: String, required: true }, // Content of the notice
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the admin or maintenance personnel
    createdAt: { type: Date, default: Date.now }, // Timestamp
  },
  { timestamps: true }
);

const Notice = models.Notice || model('Notice', NoticeSchema);
export default Notice;
