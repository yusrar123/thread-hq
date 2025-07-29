// utils/getNextWaitlistNumber.js
import Counter from "../models/counter.js";

export const getNextWaitlistNumber = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "waitlist" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    return counter.value;
};
