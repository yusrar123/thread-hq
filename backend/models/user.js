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
            return !this.waitlist; // password only required if not a waitlist user
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
});

export default mongoose.model('User', userSchema);