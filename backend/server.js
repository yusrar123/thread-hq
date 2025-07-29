import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import wishlistRoutes from "./routes/wishlist.js";

dotenv.config();

const app = express()
app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4173',
        // 'https://thread-inky.vercel.app',
        'https://www.thread-hq.com'

    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.options('*', cors());
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

