const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/thirdSectionController');

router.post('/secFour', upload.array('icons'), controller.addThirdSection);
router.put('/secFour', upload.array('icons'), controller.updateThirdSection);
router.delete('/secFour', controller.deleteThirdSection);
router.get('/secFour', controller.getThirdSection);

module.exports = router;
