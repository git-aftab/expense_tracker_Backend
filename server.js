const express = require('express')
const app = express();
const PORT = 3000;

app.use(express.json()); //Middleware to parse JSON

// In-memory data storage (temporary - resets when server restarts)
let expenses = [];
let nextId = 1;


app.get('/',(req,res)=>{
    res.send('Welcome to Expense Tracker api');
});

app.post("/expenses",(req,res)=>{
    const {amount, category, description, date} = req.body;

    const newExpense = {
        id: nextId++,
        amount,
        category,
        description,
        date: date || new Date().toISOString().split('T')[0]
    }

    expenses.push(newExpense);
    res.status(201).json({message: 'Expense added Successfully', expense: newExpense})
})

app.get('/expenses',(req,res)=>{
    res.json({
        total: expenses.length,
        expenses: expenses
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})