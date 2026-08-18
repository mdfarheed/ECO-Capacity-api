const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // custom id
  title: String,
  category: String,   // "Featured Article", "Research", "Opinion", "Media Mention", "Publication", "Op-Ed"
  icon: String,        // "Newspaper" | "FileText" | "Globe"
  source: String,      // "Global Partnerships Forum" etc.
  author: String,
  date: String,
  content1: String,    // short card description
  content2: String,    // full rich text content (Quill)
  imageUrl: String,
  imagePublicId: String,
});

module.exports = mongoose.model('Article', articleSchema);