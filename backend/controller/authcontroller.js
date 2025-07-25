import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "secret123";

//reg new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const waitlistCount = await User.countDocuments({ waitlist: true });
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            waitlist: true,
            waitlistNumber: waitlistCount + 1,

        });

        await user.save();


        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: "2d" }
        );


        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                waitlist: user.waitlist,
                waitlistNumber: waitlistCount + 1,

            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//login user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                waitlist: user.waitlist,
                waitlistNumber: user.waitlistNumber,
            },
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};