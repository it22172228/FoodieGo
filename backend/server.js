import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./services/auth/routes/authRoutes.js";
import { getAllUsers, updateUserStatus } from "./admin/userManagement.js"; // Import admin controllers

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // Use your main server port

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Admin routes integrated into the main server
app.get("/api/admin/users", getAllUsers);
app.patch("/api/admin/users/:id", updateUserStatus);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Auth Service DB connected");
        app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
    })
    .catch((err) => console.log(err));