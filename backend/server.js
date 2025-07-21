import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config(); // Load .env file

const app = express()
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);






mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(" Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log(` Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error(" MongoDB connection failed:", err.message);
    });


