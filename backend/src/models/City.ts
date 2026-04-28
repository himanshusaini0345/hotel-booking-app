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



export default mongoose.model<ICity>('City', citySchema);
