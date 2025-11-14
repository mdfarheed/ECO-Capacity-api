const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    messages: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model('Contact', contactSchema);
