const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // 👈 custom id
  title: String,
  title2: String,
  author: String,
  date: String,
  content1: String,
  content2: String,
  catagory: String, // ✅ NEW field added
  imageUrl: String,
  imagePublicId: String,
});

module.exports = mongoose.model('Blog', blogSchema);
