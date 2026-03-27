const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  country: { type: String, default: 'India' },
  rating: { type: Number, min: 1, max: 5 },
  amenities: [{ type: String }],
  pricePerNight: { type: Number, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
