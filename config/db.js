const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined');
    }

    // Protect against incorrectly configured environment variable
    if (mongoURI.startsWith('MONGO_URI=')) {
      mongoURI = mongoURI.replace(/^MONGO_URI=/, '');
    }

    mongoURI = mongoURI.trim();

    if (
      !mongoURI.startsWith('mongodb://') &&
      !mongoURI.startsWith('mongodb+srv://')
    ) {
      throw new Error(
        'Invalid MONGO_URI. Expected mongodb:// or mongodb+srv://'
      );
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(mongoURI, {
      readPreference: 'primary',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000
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
    console.error(
      'MongoDB connection failed ❌:',
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;