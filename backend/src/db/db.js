import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      "MONGO_URI not set. Skipping MongoDB connection. Set MONGO_URI in your environment for full DB functionality."
    );
    return;
  }

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser and useUnifiedTopology are default in mongoose v6+
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err?.message || err);
    // Do not exit the process in serverless environments; just log the error.
  }
};

export default connectDB;