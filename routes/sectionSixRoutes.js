const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/sectionSixController');

router.post('/secSaven', upload.array('icons'), controller.addSectionSix);
router.get('/secSaven', controller.getSectionSix);
router.put('/secSaven', upload.array('icons'), controller.updateSectionSix);
router.delete('/secSaven', controller.deleteSectionSix);

module.exports = router;
