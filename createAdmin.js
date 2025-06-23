// scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error:', err));

const createAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin@1234', // hashing schema me ho raha h
      profileImage: ''
    });

    console.log('✅ Admin Created:', admin);
    process.exit();
  } catch (error) {
    console.log('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
