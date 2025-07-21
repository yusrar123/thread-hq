import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WishlistItem",
        required: true,
    },
    type: {
        type: String,
        enum: ["price_drop", "back_in_stock"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Notification", notificationSchema);
