const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: String,
  title2: String, // optional — no required
  author: String,
  date: String,
  content1: String,
  content2: String,
  catagory: String,
  imageUrl: String, // optional — no required
  imagePublicId: String,
});

module.exports = mongoose.model('Blog', blogSchema);