const express = require('express');
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  updatePassword,
  resetPassword,
  sendResetOtp,
  verifyOtp,
} = require('../controllers/adminController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, upload.single('profileImage'), updateAdminProfile);
router.put('/update-password', protect, updatePassword);
router.post('/reset-password/send-otp', sendResetOtp);
router.post('/reset-password/verify-otp', verifyOtp);
router.put('/reset-password', resetPassword);

module.exports = router;