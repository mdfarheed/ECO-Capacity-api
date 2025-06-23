const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  heading: String,
  paragraph: String,
  iconUrl: String,
  iconPublicId: String,
});

const sectionSixSchema = new mongoose.Schema({
  id: Number,
  subHeading: String,
  mainHeading: String,
  items: [itemSchema],
});

module.exports = mongoose.model('SectionSix', sectionSixSchema);
