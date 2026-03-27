import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  location: string;
  cityId: mongoose.Types.ObjectId;
  stateId: mongoose.Types.ObjectId;
  country: string;
  rating?: number;
  amenities: string[];
  pricePerNight: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true },
  country: { type: String, default: 'India' },
  rating: { type: Number, min: 1, max: 5 },
  amenities: [{ type: String }],
  pricePerNight: { type: Number, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

hotelSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

hotelSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IHotel>('Hotel', hotelSchema);
