const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Load environment variables FIRST
dotenv.config();

// Then initialize Stripe routes
const stripeRoutes = require('./Routes/PaymentRoutes');

<<<<<<< Updated upstream
app.use("/", stripeRoutes);
=======
app.use(cors());
app.use(express.json());
app.use("/api/payments", stripeRoutes);
>>>>>>> Stashed changes

const PORT = process.env.PORT || 5400;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
