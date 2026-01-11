import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
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
): Promise<void> => {
  try {
    const User = (await import("../models/user")).default;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.isPremium) {
      res.status(403).json({
        message: "Premium subscription required",
        isPremium: false,
      });
      return;
    }

    // Check if premium has expired
    if (user.premiumExpiresAt && user.premiumExpiresAt < new Date()) {
      user.isPremium = false;
      await user.save();
      res.status(403).json({
        message: "Premium subscription has expired",
        isPremium: false,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
