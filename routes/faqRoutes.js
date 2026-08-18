const express = require('express');
const router = express.Router();

const {
  addFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq
} = require('../controllers/faqController');

router.post('/faqs', addFaq);
router.delete('/faqs/:id', deleteFaq);
router.put('/faqs/:id', updateFaq);
router.get('/faqs', getAllFaqs);

module.exports = router;