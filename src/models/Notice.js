import mongoose, { Schema, model, models } from "mongoose";

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true }, // Title of the notice
    content: { type: String, required: true }, // Content of the notice
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true }, // Associated hostel
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Maintainer who posted the notice
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Notice = models.Notice || model("Notice", NoticeSchema);
export default Notice;
