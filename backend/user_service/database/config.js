const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Successfully");

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB connection lost!");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });

  } catch (error) {
    console.error(`❌ Error Connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
