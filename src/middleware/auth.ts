import { Request, response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Token from header
    const token = req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, Authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const premiumMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const User = (await import("../models/user")).default;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        message: "Premium subscription required",
        isPremium: false,
      });
    }

    // Check if Premium has expired
    if (user.premiumExpiresAt && user.premiumExpiresAt < new Date()) {
      user.isPremium = false;
      await user.save();
      return res.status(403).json({
        message: "Premium Subscription has EXPIRED",
        isPremium: false,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
