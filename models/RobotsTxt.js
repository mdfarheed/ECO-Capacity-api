const mongoose = require('mongoose');

const robotsTxtSchema = new mongoose.Schema({
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('RobotsTxt', robotsTxtSchema);
