const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  imageUrl: String,
  imagePublicId: String,
  iconUrl: String,
  iconPublicId: String,
  heading: String,
  paragraph: String,
});

const sectionFifthSchema = new mongoose.Schema({
  id: Number,
  subHeading: String,
  mainHeading: String,
  para: String,
  items: [itemSchema],
});

module.exports = mongoose.model('SectionFifth', sectionFifthSchema);
