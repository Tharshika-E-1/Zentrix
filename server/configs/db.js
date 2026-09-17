import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ FULL ERROR:");
    console.error(error);
    throw error;
  }
};

export default connectDB;