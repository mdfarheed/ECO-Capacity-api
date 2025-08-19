const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // custom id
  location: String,
  date: String,
  map: String,
  title: String,
  tags: [String], // tags as array
  description: String,

  bannerImageUrl: String,
  bannerImagePublicId: String,

  cardImageUrl: String,
  cardImagePublicId: String,
});

module.exports = mongoose.model('Event', eventSchema);
