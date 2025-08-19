const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  subscriberEmail: {
    type: String,
    required: true,
  },
  type: {
    type: String, // 'blog' or 'event'
    required: true,
  },
  contentId: {
    type: Number, // blog.id or event.id
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

notificationLogSchema.index({ subscriberEmail: 1, type: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
