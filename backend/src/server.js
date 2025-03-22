const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const deliveryRoutes = require('./routes/deliveryRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/deliveries', deliveryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
