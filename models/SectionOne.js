const mongoose = require('mongoose');

const sectionOneSchema = new mongoose.Schema({
  id: Number, // custom ID
  heading: String,
  para: String,
  imageUrl: String,
  imagePublicId: String
});

module.exports = mongoose.model('SectionOne', sectionOneSchema);
