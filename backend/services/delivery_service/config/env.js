const dotenv =require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 2025;
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;


module.exports = { PORT, BASE_URL, MONGO_URI, JWT_SECRET };