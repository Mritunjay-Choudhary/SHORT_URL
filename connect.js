import mongoose from "mongoose";

export async function connectToMongoDB(url) {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Connection Failed:", error);
    process.exit(1);
  }
}
