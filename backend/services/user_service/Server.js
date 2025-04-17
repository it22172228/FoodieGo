const express=require("express");
const mongoose=require("mongoose");
const connectDB=require("./database/config.js");
const dotenv=require("dotenv");
const cors=require("cors");
const app=express();
const bodyParser = require('body-parser');

//Link routes
const FoodMenuRoute=require("./Routes/FoodMenuRoutes.js");
const categoryRoutes = require('./Routes/CategoryRoutes.js');
const bannerRoutes = require('./Routes/BannerRoutes.js');
const CartRoutes=require('./Routes/CartManagementRoutes.js');

dotenv.config();
connectDB();
app.use(express.json({ limit: '100mb' })); // Ensure express.json() has a high limit

app.use(cors());

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
    }));

//Routes apis
app.use("/api",FoodMenuRoute)
app.use("/api", categoryRoutes)
app.use("/api", bannerRoutes)
app.use("/carts",CartRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});