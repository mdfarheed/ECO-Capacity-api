// models/SeoMeta.js
const mongoose = require('mongoose');

const seoMetaSchema = new mongoose.Schema({
  page: { type: String, unique: true, required: true },

  title: String,
  description: String,
  keywords: String,
  canonical: String,

  ogTitle: String,
  ogDescription: String,
  ogImageUrl: String,
  ogImagePublicId: String,

  twitterTitle: String,
  twitterDescription: String,
  twitterImageUrl: String,
  twitterImagePublicId: String,

  faviconUrl: String,
  faviconPublicId: String,
}, { timestamps: true });

module.exports = mongoose.model('SeoMeta', seoMetaSchema);
