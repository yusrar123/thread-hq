import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        trim: true,
    },
    productTitle: {
        type: String,
        required: true,
        trim: true,
    },
    brandId: {
        type: String,
        required: true,
        trim: true,
    },
    brandName: {
        type: String,
        required: true,
        trim: true,
    },
    buyer: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: String,
            required: true,
            trim: true,
        }
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "COD"],
        default: "unpaid",
    },
    deliveryDate: {
        type: Date,
        default: null,
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);
