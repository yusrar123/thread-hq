import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productUrl: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
    price: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["loading", "fetched", "unavailable"],
        default: "loading",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("WishlistItem", wishlistItemSchema);
