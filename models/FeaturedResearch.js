const mongoose = require('mongoose');

const featuredResearchSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // custom incremental id (like blog/article)
    title: String,
    subtitle: String,
    slug: { type: String, unique: true }, // auto-generated from title
    image: String,        // matches your requested field name
    imageUrl: String,     // cloudinary url (used for display, same pattern as blog/article)
    imagePublicId: String,
    type: String,          // e.g. "Research Paper", "White Paper", "Policy Brief"
    shortDescription: String, // for card
    audience: String,      // e.g. "Sovereign, ministerial and SWF audiences"
    tags: [String],        // array of tags
    source: String,
    date: String,
    fullDescription: String, // Quill rich text (like content2)
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeaturedResearch', featuredResearchSchema);