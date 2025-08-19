const Admin = require('../models/Admin');
const OtpToken = require('../models/OtpToken');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const { cloudinary } = require('../config/cloudinary');

// 🔢 OTP generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔐 Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// 🟢 Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
    });
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
};

// 🟡 Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const { name, email } = req.body;

  if (name) admin.name = name;
  if (email) admin.email = email;

  if (req.file) {
    // Delete old image
    if (admin.imagePublicId) {
      await cloudinary.uploader.destroy(admin.imagePublicId);
    }
    admin.profileImage = req.file.path;
    admin.imagePublicId = req.file.filename;
  }

  const updatedAdmin = await admin.save();
  res.json(updatedAdmin);
};

// 🔁 Update Password (logged in)
exports.updatePassword = async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const isMatch = await admin.matchPassword(oldPassword);
  if (!isMatch) {
    return res.status(401).json({ message: 'Old password is incorrect' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  admin.password = newPassword;
  await admin.save();
  res.json({ message: 'Password updated successfully' });
};

// ✉️ Send OTP for Reset Password
exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const otp = generateOtp();
  await OtpToken.create({ email, otp });

  const html = `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`;
  await sendEmail(email, 'Reset Password OTP', html);

  res.json({ message: 'OTP sent to email' });
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpToken = await OtpToken.findOne({ email, otp });

  if (!otpToken) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  res.json({ message: 'OTP verified successfully' });
};

// 🔁 Reset Password with OTP
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword, otp } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password too short' });
  }

  const otpToken = await OtpToken.findOne({ email, otp });
  if (!otpToken) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  admin.password = newPassword;
  await admin.save();

  await OtpToken.deleteMany({ email }); // Clear all old OTPs

  res.json({ message: 'Password reset successfully' });
};
