const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  imageUrl: String,
  imagePublicId: String,
  heading: String,
  paragraph: String,
});

const sectionNineSchema = new mongoose.Schema({
  id: Number, // custom ID
  mainImageUrl: String,
  mainImagePublicId: String,
  items: [itemSchema],
});

module.exports = mongoose.model('SectionNine', sectionNineSchema);
