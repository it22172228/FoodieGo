const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT, BASE_URL } = require("./config/env");

// Routes
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

// Create express app
const app = express();


// Middleware to allow CORS
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware to parse incoming JSON data
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/delivery", deliveryRoutes);

// Catch undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

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