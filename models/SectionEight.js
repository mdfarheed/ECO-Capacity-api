const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  imageUrl: String,
  imagePublicId: String,
  designation: String,
  catagory: String, // ✅ New Field Added
  name: String,
  subDescription: String,
  fullDescription: String,
});

const sectionEightSchema = new mongoose.Schema({
  id: Number, // custom ID
  heading: String,
  subHeading: String,
  para: String,
  items: [itemSchema],
});

module.exports = mongoose.model('SectionEight', sectionEightSchema);
