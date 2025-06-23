const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionOneController');

// All routes
router.post('/secTwo', upload.single('image'), controller.addSectionOne);
router.put('/secTwo', upload.single('image'), controller.updateSectionOne);
router.delete('/secTwo', controller.deleteSectionOne);
router.get('/secTwo', controller.getSectionOne);

module.exports = router;
