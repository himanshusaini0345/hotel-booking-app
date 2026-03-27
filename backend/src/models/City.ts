import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const citySchema: Schema = new Schema({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true }
}, { timestamps: true });

citySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

citySchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<ICity>('City', citySchema);
