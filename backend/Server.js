const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT, BASE_URL } = require("./config/env");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
// Create express app
const app = express();


// Middleware to allow CORS
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(cors()); 


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api", menuRoutes); 

// Database Connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database connection error:", err);
  });

module.exports = app;