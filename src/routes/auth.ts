import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already Exists with this email" });
    }

    // Create new User
    const user = new User({
      // this User({}) comes creates new user from mongo -> models/user
      name,
      email,
      password,
    });

    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Login
router.post("/Login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email" });
    }

    // Chek Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get current user (Protected Route)
router.get(
  "/me",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);

export default router;
