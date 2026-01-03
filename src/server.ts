import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";
import paymentRoutes from "./routes/payment";
import { error } from "node:console";

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cors - Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB atlas");
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
    process.exit(1);
  });

// Routes

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Expense Tracker API v2.0 !",
    endPoints: {
      auth: "/api/auth",
      expenses: "/api/expenses",
      payment: "/api/payment",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling middleware;
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(error.stack);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});