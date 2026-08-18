const mongoose = require('mongoose');

const CATEGORY_OPTIONS = ["General", "Investors", "Corporates", "Governments", "Development Institutions"];

const faqSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    category: {
      type: String,
      enum: CATEGORY_OPTIONS,
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }, // 👈 category ke andar sorting ke liye
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);
module.exports.CATEGORY_OPTIONS = CATEGORY_OPTIONS;