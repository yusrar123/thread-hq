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
    originalPrice: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["loading", "fetched", "unavailable", "LOADING", "AVAILABLE", "UNAVAILABLE", "OUT_OF_STOCK", "WATCHING"],
        default: "loading",
    },
    availability: {
        type: String,
        enum: ["IN_STOCK", "OUT_OF_STOCK", "LIMITED_STOCK", "UNKNOWN"],
        default: "UNKNOWN",
    },
    isOnSale: {
        type: Boolean,
        default: false,
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    lastChecked: {
        type: Date,
        default: Date.now,
    },
    priceHistory: [{
        price: String,
        originalPrice: String,
        checkedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("WishlistItem", wishlistItemSchema);
