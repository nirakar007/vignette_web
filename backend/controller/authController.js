import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// register function
export async function register(req, res) {
  const { email, password } = req.body;

  try {
    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    // create new user
    const newUser = new User({
      email,
      password,
    });

    // save the user to the database
    const savedUser = await newUser.save();

    // generate a JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
}

// login function
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // compare the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login Succesful!",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to login.." });
  }
}
