const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionNineController');

router.post(
  '/secTen',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 50 }
  ]),
  controller.addSectionNine
);

router.put(
  '/secTen',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 50 }
  ]),
  controller.updateSectionNine
);

router.delete('/secTen', controller.deleteSectionNine);
router.get('/secTen', controller.getSectionNine);


module.exports = router;
