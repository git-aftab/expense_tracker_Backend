app.use(express.json()) - This middleware lets Express understand JSON data sent in requests

expenses = [] - Array to store our expenses

nextId = 1 - Counter for assigning unique IDs to expenses



1. Understanding req.body
javascriptconst { amount, category, description, date } = req.body;
What is req.body?

req = the request object (data coming FROM the client/user)
body = the main content of the request
When someone sends data to your API, it comes in req.body

Example: If someone sends this JSON:
json{
  "amount": 50,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-12-02"
}
Then:

req.body.amount = 50
req.body.category = "Food"
req.body.description = "Lunch"
req.body.date = "2024-12-02"

The destructuring syntax:
javascriptconst { amount, category, description, date } = req.body;
This is a shortcut for:
javascriptconst amount = req.body.amount;
const category = req.body.category;
const description = req.body.description;
const date = req.body.date;
It extracts multiple properties at once!

2. Understanding .split('T')[0]
javascriptdate: date || new Date().toISOString().split('T')[0]
Let me break this down:
Step by step:

new Date() creates today's date object

Example: Mon Dec 02 2024 14:30:00 GMT+0530


.toISOString() converts it to a standard string format

Result: "2024-12-02T14:30:00.000Z"


.split('T') splits the string at the letter "T"

Result: ["2024-12-02", "14:30:00.000Z"] (an array with 2 parts)


[0] gets the first element of the array

Result: "2024-12-02" (just the date, no time!)



The || (OR) operator:
javascriptdate: date || new Date().toISOString().split('T')[0]
This means:

If user provides a date, use it
If user doesn't provide a date (it's undefined), use today's date