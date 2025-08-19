// routes/seoRoutes.js
const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const upload = require('../middleware/upload');

// SEO Meta
router.get('/meta', seoController.getAllMeta);
router.get('/meta/:page', seoController.getMetaByPage);

router.post('/meta',
  upload.fields([
    { name: 'ogImage', maxCount: 1 },
    { name: 'twitterImage', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  seoController.addSeoMeta
);

router.put(
  '/meta/:page',
  upload.fields([
    { name: 'ogImage', maxCount: 1 },
    { name: 'twitterImage', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  seoController.updateSeoMeta
);


router.delete('/meta/:page', seoController.deleteMeta);

// robots.txt
router.get('/robots.txt', seoController.getRobotsTxt);
router.post('/robots.txt', seoController.updateRobotsTxt);


// sitemap
router.get('/sitemap.xml', seoController.generateSitemap);

module.exports = router;
