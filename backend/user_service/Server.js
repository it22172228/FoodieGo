const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Connecting DB logic
const { PORT, BASE_URL } = require("./config/env"); // Using config values

// Import Routes
const FoodMenuRoute = require("./Routes/FoodMenuRoutes.js");
const categoryRoutes = require("./Routes/CategoryRoutes.js");
const bannerRoutes = require("./Routes/BannerRoutes.js");
const CartRoutes = require("./Routes/CartManagementRoutes.js");
const authRoutes = require("./Routes/authRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// API Routes
app.use("/api/food", FoodMenuRoute);
app.use("/api/category", categoryRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/auth", authRoutes);

// Start the server after DB connection
const startServer = async () => {
  await connectDB();  // Ensure DB is connected first
  app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}`);
  });
};

startServer();