const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas using MONGODB_URI from environment variables.
 * Exits the process if the connection cannot be established.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.error('Error: MONGODB_URI is not set. Copy .env.example to .env and add your Atlas connection string.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
