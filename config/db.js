const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(process.env.MONGO_URI, {
      readPreference: 'primary',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected ✅');

    const db = mongoose.connection;

    db.on('disconnected', () => {
      console.error('MongoDB disconnected ❌');
    });

    db.on('reconnected', () => {
      console.log('MongoDB reconnected ✅');
    });

    db.on('error', (err) => {
      console.error('MongoDB error:', err.message);
    });

  } catch (error) {
    console.error('MongoDB connection failed ❌:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;