const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  country: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);
