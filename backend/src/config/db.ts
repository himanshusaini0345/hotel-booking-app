import mongoose from 'mongoose';

const stripIds = (_doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
};

mongoose.set("toJSON", { transform: stripIds });
mongoose.set("toObject", { transform: stripIds });

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_task');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
