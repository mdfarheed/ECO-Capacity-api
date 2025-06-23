const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  appleLogin,
  sendUserResetOtp,
  verifyUserOtp,
  resetUserPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/google', googleLogin);
router.post('/login/apple', appleLogin);
router.post('/user/reset-password/send-otp', sendUserResetOtp);
router.post('/user/reset-password/verify-otp', verifyUserOtp);
router.put('/user/reset-password', resetUserPassword);
module.exports = router;
