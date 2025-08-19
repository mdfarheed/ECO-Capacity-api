const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const upload = require('../middleware/upload');

router.post('/secOne', upload.single('bannerVedio'), heroController.addHero);
router.put('/secOne', upload.single('bannerVedio'), heroController.updateHero);
router.delete('/secOne', heroController.deleteHero);
router.get('/secOne', heroController.getHero);

module.exports = router;
