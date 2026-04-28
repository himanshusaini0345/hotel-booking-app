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



export default mongoose.model<IState>('State', stateSchema);
