import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        // required: true,
        minlength: 6,
        select: false,
        required: function () {
            return !this.waitlist;
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    waitlist: {
        type: Boolean,
        default: true,
    },
    waitlistNumber: {
        type: Number,
        unique: true,
        sparse: true,
    },
    waitlistTotal: {
        type: Number,
        default: 50,
    },
});

export default mongoose.model('User', userSchema);