require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('Database Name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ ERROR! Failed to connect');
    console.log('Error message:', error.message);
    process.exit(1);
  });