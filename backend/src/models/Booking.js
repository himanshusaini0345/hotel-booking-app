const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  // 0: CONFIRMED, 1: CANCELLED, 2: COMPLETED
  status: { type: Number, default: 0, enum: [0, 1, 2] },
  bookingDate: { type: Date, default: Date.now },
  specialRequests: { type: String }
}, { timestamps: true });

bookingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

bookingSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
