import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Register a new user
export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Generate a token for the user
        const token = jwt.sign(
            { id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        res.status(201).json({ token, user: { id: savedUser._id, name, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error. Could not register user." });
    }
}

// Login an existing user
export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid email or password." });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error. Could not log in." });
    }
}

// Get user profile
export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error. Could not fetch user profile." });
    }
}

// get all users --admin only
export async function getAllUsers(req, res){
    try{
        // show users excluding their passwords
        const users = await User.find().select("-password");

        if(!users.length){
            return res.status(404).json({error: "No users found."});
        }

        res.status(200).json(users);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Server error: could not fetch users."})
    }
}