const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
  },
  mobile: String,
  messages: [
    {
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Contact', contactSchema);
