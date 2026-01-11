import express, { Response } from "express";
import Expense from "../models/expense";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import expense from "../models/expense";

const router = express.Router();

// All routes are protected - require authentication
router.use(authMiddleware);

// Get all expenses for the logged in user
router.get("/", async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json({
      total: expenses.length,
      expenses,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get total spending
router.get(
  "/total/spending",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const expenses = await Expense.find({ userId: req.userId });
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      res.json({
        totalExpenses: expenses.length,
        totalAmount: total,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

// Get expense by Category
router.get(
  "/category/:categoryName",
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { categoryName } = req.params;
      const expenses = await Expense.find({
        userId: req.userId,
        category: new RegExp(`^${categoryName}$`, "i"),
      }).sort({ date: -1 });

      res.json({
        category: categoryName,
        total: expenses.length,
        expenses,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

// Add new response;
router.post("/", async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = new Expense({
      userId: req.userId,
      amount,
      category,
      description,
      date: date || new Date().toISOString().split("T")[0],
    });

    await expense.save();

    res.status(201).json({
      message: "Expense Added Successfully",
      expense,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Update an Expense
router.put("/:id", async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    const expense = await Expense.findOne({ _id: id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    //update
    if (amount != undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (description) expense.description = description;
    if (date) expense.date = date;

    await expense.save();
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    }
    res.json({
      message: "Expense deleted Successfully",
      expense,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
