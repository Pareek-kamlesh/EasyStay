import mongoose from "mongoose";

const MaintainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  hostels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hostel" }], // Assigned hostels
});

export default mongoose.models.Maintainer || mongoose.model("Maintainer", MaintainerSchema);
