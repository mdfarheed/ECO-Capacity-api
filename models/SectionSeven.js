const mongoose = require('mongoose');

const sectionSevenSchema = new mongoose.Schema({
  id: Number, // Custom ID
  subHeading: String,
  mainHeading: String,
  para: String,
  imageUrl: String,
  imagePublicId: String
});

module.exports = mongoose.model('SectionSeven', sectionSevenSchema);
