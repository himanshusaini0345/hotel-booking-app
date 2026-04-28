import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  checkInDate: Date;
  numberOfGuests: number;
  status: number;
  bookingDate: Date;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  // 0: CONFIRMED, 1: CANCELLED, 2: COMPLETED
  status: { type: Number, default: 0, enum: [0, 1, 2] },
  bookingDate: { type: Date, default: Date.now },
  specialRequests: { type: String }
}, { timestamps: true });



export default mongoose.model<IBooking>('Booking', bookingSchema);
