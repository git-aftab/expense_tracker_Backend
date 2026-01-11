import express, { Response } from "express";
import crypto from "crypto";
import User from "../models/user";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Note: For actual Razorpay integration, we need to install: npm install razorpay
// For now, this is a demo flow showing how it would work

router.use(authMiddleware);

// Create order (Step 1: Frontend requests payment)
router.post(
  "/create-order",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      // In production, we would use Razorpay SDK:
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({
      //   key_id: process.env.RAZORPAY_KEY_ID,
      //   key_secret: process.env.RAZORPAY_KEY_SECRET
      // });

      const amount = 9900; // ₹99 in paise (smallest currency unit)

      // Demo order object (in production, this comes from Razorpay)
      const order = {
        id: `order_${Date.now()}`,
        amount,
        currency: "INR",
        receipt: `receipt_${req.userId}`,
        status: "created",
      };

      // In production, you would create order like this:
      // const order = await razorpay.orders.create({
      //   amount,
      //   currency: 'INR',
      //   receipt: `receipt_${req.userId}`
      // });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "demo_key_id",
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to create order", error: error.message });
    }
  }
);

// Verify payment (Step 2: After user completes payment on Razorpay)
router.post(
  "/verify-payment",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { orderId, paymentId, signature } = req.body;

      // In production, verify the signature:
      // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
      // hmac.update(`${orderId}|${paymentId}`);
      // const generatedSignature = hmac.digest('hex');

      // if (generatedSignature !== signature) {
      //   return res.status(400).json({ message: 'Invalid payment signature' });
      // }

      // For demo purposes, we'll just upgrade the user to premium
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Upgrade to premium (1 year subscription)
      user.isPremium = true;
      user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      await user.save();

      res.json({
        message: "Payment verified successfully! You are now a premium user.",
        isPremium: true,
        premiumExpiresAt: user.premiumExpiresAt,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Payment verification failed", error: error.message });
    }
  }
);

// Check premium status
router.get(
  "/premium-status",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
