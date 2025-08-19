const User = require('../models/User');
const Counter = require('../models/Counter');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');
const OtpToken = require('../models/OtpToken');
const sendEmail = require('../utils/sendEmail');

// 🔑 Google Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// 🔁 Get Custom Auto-Incremented ID
const getNextUserId = async () => {
  let counter = await Counter.findOne({ name: 'user_id' });
  if (!counter) {
    counter = await Counter.create({ name: 'user_id', value: 1 });
  } else {
    counter.value += 1;
    await counter.save();
  }
  return counter.value;
};

// ✅ Register User
exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      id: await getNextUserId(),
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({
      message: 'User registered successfully ✅',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful ✅',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        id: await getNextUserId(),
        name,
        email,
        phone: "N/A",
        password: "google-auth", // dummy password
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Google login successful ✅',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(400).json({ message: 'Google login failed', error: error.message });
  }
};

// ✅ Apple Login
exports.appleLogin = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    const clientSecret = appleSignin.getClientSecret({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      privateKey: fs.readFileSync('./AuthKey.p8').toString(),
      keyIdentifier: process.env.APPLE_KEY_ID,
      expAfter: 15777000, // 6 months
    });

    const tokenResponse = await appleSignin.getAuthorizationToken(code, {
      clientID: process.env.APPLE_CLIENT_ID,
      clientSecret,
      redirectUri,
    });

    const userData = await appleSignin.verifyIdToken(tokenResponse.id_token, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: true,
    });

    const { email } = userData;

    let user = await User.findOne({ email });

    if (!user) {
      const name = userData.name || "Apple User";
      user = await User.create({
        id: await getNextUserId(),
        name,
        email,
        phone: "N/A",
        password: "apple-auth", // dummy password
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Apple login successful ✅',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(400).json({ message: 'Apple login failed', error: error.message });
  }
};


// 🔢 Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP to user email
exports.sendUserResetOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOtp();
  await OtpToken.create({ email, otp });

  const html = `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`;
  await sendEmail(email, 'Reset Password OTP', html);

  res.json({ message: 'OTP sent to email' });
};

// ✅ Verify OTP
exports.verifyUserOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpToken = await OtpToken.findOne({ email, otp });
  if (!otpToken) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  res.json({ message: 'OTP verified successfully' });
};

// ✅ Reset Password
exports.resetUserPassword = async (req, res) => {
  const { email, newPassword, confirmPassword, otp } = req.body;
  if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'Password too short' });

  const otpToken = await OtpToken.findOne({ email, otp });
  if (!otpToken) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = newPassword;
  await user.save();
  await OtpToken.deleteMany({ email });

  res.json({ message: 'Password reset successfully' });
};