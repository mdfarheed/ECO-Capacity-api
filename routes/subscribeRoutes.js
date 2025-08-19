const express = require('express');
const router = express.Router();
const {
  subscribeUser,
  unsubscribeUser,
  unsubscribeFromLink,
} = require('../controllers/subscribeController');

router.post('/subscribe', subscribeUser);       // /api/subscribe
router.delete('/unSubscribe', unsubscribeUser);   // /api/subscribe
router.get('/unsubscribeToEmail', unsubscribeFromLink);
module.exports = router;
