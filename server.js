const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json()); //Middleware to parse JSON

const dataFilePath = path.join(__dirname,'data.json');


const readData = ()=>{
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
let expenses = readData()
let nextId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
// Helper function to write data file
const writeData = (data)=>{
  fs.writeFileSync(dataFilePath,JSON.stringify(data,null,2));
}

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker api");
});

app.post("/expenses", (req, res) => {
  expenses = readData(); //read current data
  const { amount, category, description, date } = req.body;

  const newExpense = {
    id: nextId++,
    amount,
    category,
    description,
    date: date || new Date().toISOString().split("T")[0],
  };

  expenses.push(newExpense);
  writeData(expenses) // save to file
  res
    .status(201)
    .json({ message: "Expense added Successfully", expense: newExpense });
});

app.get("/expenses", (req, res) => {
  expenses = readData();
  res.json({
    total: expenses.length,
    expenses: expenses,
  });
});

// Get total spending
app.get("/expenses/total/spending", (req, res) => {
  expenses = readData();
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  res.json({
    totalExpenses: expenses.length,
    totalAmount: total,
  });
});

app.get("/expenses/category/:categoryName", (req, res) => {
  expenses = readData()
  const category = req.params.categoryName;
  const filteredExpenses = expenses.filter(
    (expense) => expense.category.toLowerCase() === category.toLowerCase()
  );

  res.json({
    category: category,
    total: filteredExpenses.length,
    expenses: filteredExpenses,
  });
});

// update an expense
app.put("/expenses/:id", (req, res) => {
  expenses = readData();
  const id = parseInt(req.params.id);
  const { amount, category, description, date } = req.body;

  const expenseIndex = expenses.findIndex((expense) => (expense.id = id));
  if (expenseIndex === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  // udate the expense
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    amount: amount || expenses[expenseIndex].amount,
    category: category || expense[expenseIndex].category,
    description: description || expenses[expenseIndex].description,
    date: date || expenses[expenseIndex].date,
  };

  writeData(expenses)

  res.json({
    message: "Expense update successfully",
    expense: expenses[expenseIndex],
  });
});

app.delete("/expenses/:id", (req, res) => {
  expenses = readData();
  const id = parseInt(req.params.id);
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);

  if (expenseIndex === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const deletedExpense = expenses.splice(expenseIndex, 1);
  writeData(expenses)

  res.json({
    message: "Expense Deleted Successfully",
    expense: deletedExpense[0],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
