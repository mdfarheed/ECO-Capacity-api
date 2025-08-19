const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // custom id
  bannerVedioUrl: String,
  bannerVedioPublicId: String,
  bannerHeading: String,
  bannerPara: String
});

module.exports = mongoose.model('Hero', heroSchema);
