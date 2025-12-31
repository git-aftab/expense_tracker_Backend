require('dotenv').config();

console.log('Environment Variables Test:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('');
console.log('Full MongoDB URI:', process.env.MONGODB_URI);