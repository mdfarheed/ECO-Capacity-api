const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionFifthController');

// Use upload.fields to handle named multiple arrays
router.post('/secSix', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'icons', maxCount: 10 }
]), controller.addSectionFifth);

router.put('/secSix', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'icons', maxCount: 10 }
]), controller.updateSectionFifth);

router.delete('/secSix', controller.deleteSectionFifth);
router.get('/secSix', controller.getSectionFifth);

module.exports = router;
