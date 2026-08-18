const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  addResearch,
  updateResearch,
  deleteResearch,
  getAllResearch,
  getResearchBySlug,
} = require('../controllers/researchController');

router.post('/research', upload.single('image'), addResearch);
router.put('/research/:id', upload.single('image'), updateResearch);
router.delete('/research/:id', deleteResearch);
router.get('/research', getAllResearch);
router.get('/research/slug/:slug', getResearchBySlug);

module.exports = router;