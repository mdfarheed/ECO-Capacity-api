const express = require('express');
const router = express.Router();
const { contactUs, getAllContacts, deleteContact } = require('../controllers/contactController');

router.post('/contact', contactUs);
router.get('/contact', getAllContacts);
router.delete('/contact/:id', deleteContact);

module.exports = router;
