const mongoose = require('mongoose');

const videoSectionSchema = new mongoose.Schema({
  id: Number, // custom ID
  heading: String,
  videoUrl: String,
  videoPublicId: String,
});

module.exports = mongoose.model('VideoSection', videoSectionSchema);
