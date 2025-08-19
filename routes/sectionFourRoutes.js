const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionFourController');

// ✅ Upload fields: image + icons
router.post(
  '/secFive',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icons' }]),
  controller.addSectionFour
);

router.put(
  '/secFive',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icons' }]),
  controller.updateSectionFour
);

router.delete('/secFive', controller.deleteSectionFour);
router.get('/secFive', controller.getSectionFour);

module.exports = router;