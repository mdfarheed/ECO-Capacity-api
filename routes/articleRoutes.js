const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  addArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
} = require('../controllers/articleController');

router.post('/articles', upload.single('image'), addArticle);
router.put('/articles/:id', upload.single('image'), updateArticle);
router.delete('/articles/:id', deleteArticle);
router.get('/articles', getAllArticles);

module.exports = router;