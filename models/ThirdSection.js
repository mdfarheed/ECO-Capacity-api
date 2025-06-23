const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  iconUrl: String,
  iconPublicId: String,
  heading: String,
  paragraph: String,
});

const thirdSectionSchema = new mongoose.Schema({
  id: Number, // custom ID
  heading: String,
  paragraph: String,
  items: [itemSchema],
});

module.exports = mongoose.model('ThirdSection', thirdSectionSchema);
