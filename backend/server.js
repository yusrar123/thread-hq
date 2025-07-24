import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import wishlistRoutes from "./routes/wishlist.js";

dotenv.config(); // Load .env file

const app = express()
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: [
        'http://localhost:3000',           // React default port
        'http://localhost:5173',           // Vite default port
        'http://localhost:4173',           // Vite preview port
        // 'https://thread-3z6nkm94t-sub-ainas-projects.vercel.app/',
        'https://thread-hq-sub-ainas-projects.vercel.app/',

    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);


const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(" Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(` Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error(" MongoDB connection failed:", err.message);
    });


