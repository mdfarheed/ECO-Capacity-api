const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionEightController');

router.post(
  '/secNine',
  upload.fields([{ name: 'images', maxCount: 50 }]),
  controller.addSectionEight
);

router.put(
  '/secNine',
  upload.fields([{ name: 'images', maxCount: 50 }]),
  controller.updateSectionEight
);

router.delete('/secNine', controller.deleteSectionEight);
router.get('/secNine', controller.getSectionEight);

module.exports = router;
