import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String }
}, { timestamps: true });



export default mongoose.model<IUser>('User', userSchema);
