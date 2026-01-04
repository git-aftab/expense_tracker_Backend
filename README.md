# expense_tracker_expressjs
# 💰 Expense Tracker REST API

A secure, production-ready REST API for expense tracking built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. Features include JWT authentication, user management, payment gateway integration, and comprehensive expense CRUD operations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Features

- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **Password Hashing** - bcrypt encryption for user passwords
- ✅ **MongoDB Integration** - Cloud database with MongoDB Atlas
- ✅ **TypeScript** - Full type safety and better developer experience
- ✅ **RESTful API** - Standard REST endpoints with proper HTTP methods
- ✅ **Payment Gateway** - Razorpay integration for premium features
- ✅ **User-Specific Data** - Each user only sees their own expenses
- ✅ **Category Filtering** - Filter expenses by category
- ✅ **Date Tracking** - Track expenses by date
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Environment Variables** - Secure configuration management

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Git**

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/expense-tracker-api.git
cd expense-tracker-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start development server**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Razorpay Configuration (Optional for payment features)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Getting MongoDB URI

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP address (use 0.0.0.0/0 for development)
5. Get connection string from "Connect" button

### Getting Razorpay Keys

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test Keys for development

## 🗄️ Database Setup

The application uses MongoDB with Mongoose ODM. Two main collections:

### Users Collection
- name (String, required)
- email (String, required, unique)
- password (String, hashed, required)
- isPremium (Boolean, default: false)
- premiumExpiresAt (Date, optional)
- createdAt (Date, auto-generated)

### Expenses Collection
- userId (ObjectId, reference to User)
- amount (Number, required)
- category (Enum: Food, Transport, Entertainment, Shopping, Bills, Health, Other)
- description (String, required)
- date (String, required)
- createdAt (Date, auto-generated)

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Server runs with hot-reload using ts-node-dev

### Build for Production
```bash
npm run build
```
Compiles TypeScript to JavaScript in `dist/` folder

### Production Mode
```bash
npm start
```
Runs compiled JavaScript from `dist/` folder

### Test MongoDB Connection
```bash
node test-connection.js
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isPremium": false
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Expense Endpoints

All expense endpoints require authentication via JWT token in Authorization header.

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer <token>
```

#### Add New Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "category": "Food",
  "description": "Dinner at restaurant",
  "date": "2024-01-15"
}
```

#### Get Expenses by Category
```http
GET /api/expenses/category/Food
Authorization: Bearer <token>
```

#### Get Total Spending
```http
GET /api/expenses/total/spending
Authorization: Bearer <token>
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 750,
  "description": "Updated description"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payment/create-order
Authorization: Bearer <token>
```

#### Verify Payment
```http
POST /api/payment/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx",
  "signature": "signature_xxxxx"
}
```

#### Check Premium Status
```http
GET /api/payment/premium-status
Authorization: Bearer <token>
```

## 📁 Project Structure

```
expense-tracker-api/
├── src/
│   ├── controllers/          # Business logic (optional)
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication middleware
│   ├── models/
│   │   ├── User.ts          # User schema and model
│   │   └── Expense.ts       # Expense schema and model
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── expenses.ts      # Expense CRUD routes
│   │   └── payment.ts       # Payment integration routes
│   └── server.ts            # Main application entry point
├── dist/                     # Compiled JavaScript (gitignored)
├── .env                      # Environment variables (gitignored)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── test-connection.js       # MongoDB connection test
└── README.md                # This file
```

## 🛠 Technologies Used

### Core Technologies
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM

### Security & Authentication
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - JWT tokens
- **[cors](https://github.com/expressjs/cors)** - Cross-origin resource sharing

### Development Tools
- **[ts-node-dev](https://github.com/wclr/ts-node-dev)** - TypeScript development server
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management

### Payment Integration
- **[Razorpay](https://razorpay.com/)** - Payment gateway (optional)

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Protection**: Configured CORS to prevent unauthorized access
- **Input Validation**: Mongoose schema validation for all data
- **Protected Routes**: Middleware authentication for sensitive endpoints
- **User Data Isolation**: Users can only access their own data

## 📝 Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Test MongoDB connection
node test-connection.js

# Test environment variables
node test-env.js
```

## 🐛 Common Issues & Solutions

### MongoDB Connection Fails
- Verify MongoDB URI in `.env`
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### JWT Token Invalid
- Token expires after 7 days - login again
- Ensure JWT_SECRET is set in `.env`
- Check Authorization header format: `Bearer <token>`

### CORS Errors
- Update allowed origin in `server.ts`
- Check if frontend URL matches CORS configuration

## 🚀 Deployment

### Recommended Platforms
- **[Render](https://render.com/)** - Easy deployment with free tier
- **[Railway](https://railway.app/)** - Simple deployment
- **[Vercel](https://vercel.com/)** - Serverless deployment
- **[AWS/Heroku](https://aws.amazon.com/)** - Enterprise solutions

### Deployment Steps (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

HTTPS is automatically provided by all hosting platforms.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Md Aftab**
- GitHub: [@git-aftab](https://github.com/git-aftab)
- LinkedIn: [Md Aftab](https://linkedin.com/in/md-aftab-360996328)
- Email: aftabdev18@gmail.com

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- TypeScript handbook
- Razorpay API documentation

## 📞 Support

For support, email aftabdev18@gmail.com or create an issue in the repository.

---


**Keywords:** expense tracker api, node.js rest api, express typescript, mongodb crud, jwt authentication, payment gateway integration, razorpay api, user authentication, expense management api, typescript express server, mongodb atlas integration, secure api development, rest api tutorial, node.js backend

