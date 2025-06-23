const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  iconUrl: String,
  iconPublicId: String,
  heading: String,
  paragraph: String,
});

const sectionFourSchema = new mongoose.Schema({
  id: Number, // Custom ID
  subHeading: String,
  mainHeading: String,
  subPara: String,
  mainPara: String,
  imageUrl: String,         // ✅ added
  imagePublicId: String,    // ✅ added
  items: [itemSchema],
});

module.exports = mongoose.model('SectionFour', sectionFourSchema);
