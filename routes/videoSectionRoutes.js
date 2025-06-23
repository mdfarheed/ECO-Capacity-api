const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/videoSectionController');

router.post('/secThree', upload.single('video'), controller.addVideoSection);
router.put('/secThree/:id', upload.single('video'), controller.updateVideoSection);
router.delete('/secThree/:id', controller.deleteVideoSection);
router.get('/secThree', controller.getAllVideoSections);

module.exports = router;
