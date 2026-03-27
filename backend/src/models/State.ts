import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
  name: string;
  code: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const stateSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  country: { type: String, required: true }
}, { timestamps: true });

stateSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

stateSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IState>('State', stateSchema);
