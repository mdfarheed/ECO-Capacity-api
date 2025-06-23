const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  addBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
} = require('../controllers/blogController');

router.post('/blogs', upload.single('image'), addBlog);
router.put('/blogs/:id', upload.single('image'), updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.get('/blogs', getAllBlogs);

module.exports = router;
