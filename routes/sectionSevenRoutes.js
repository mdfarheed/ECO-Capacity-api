const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionSevenController');

// ➕ Add Section Seven
router.post(
  '/secEight',
  upload.single('image'),
  controller.addSectionSeven
);

// 🔁 Update Section Seven
router.put(
  '/secEight',
  upload.single('image'),
  controller.updateSectionSeven
);

// ❌ Delete
router.delete('/secEight', controller.deleteSectionSeven);

// 📄 Get
router.get('/secEight', controller.getSectionSeven);

module.exports = router;
