const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined!');
      console.error('Please set MONGO_URI in your environment variables.');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.error('MONGO_URI starts with:', process.env.MONGO_URI?.substring(0, 20) + '...');
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;