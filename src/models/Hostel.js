const mongoose = require('mongoose');
const { Schema, model, models } = mongoose;

const HostelSchema = new Schema(
  {
    name: { type: String, required: true }, // Hostel name
    address: { type: String, required: true }, // Hostel address
    amenities: { type: [String], required: true }, // List of amenities (e.g., WiFi, Gym)
    rooms: [
      {
        type: { type: String, required: true }, // Room type (e.g., Single, Double)
        rent: { type: Number, required: true }, // Monthly rent
        availability: { type: Boolean, default: true }, // Availability status
      },
    ],
    owner: {
      name: { type: String, required: true }, // Name of the owner
      contact: { type: String, required: true }, // Contact details of the owner
    },
    photos: { type: [String], default: [] }, // Array of photo URLs
    notices: [{ type: Schema.Types.ObjectId, ref: 'Notice' }], // Reference to notices
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Students enrolled in the hostel
    maintenance: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Assigned maintenance personnel
    guards: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Assigned guards
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Hostel = models.Hostel || model('Hostel', HostelSchema);
module.exports = Hostel;
