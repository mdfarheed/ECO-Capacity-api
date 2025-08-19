const express = require('express');
const router = express.Router();
const {
  addEvent,
  getAllEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const upload = require('../middleware/upload');

// Add Event (2 images)
router.post(
  '/events',
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'cardImage', maxCount: 1 },
  ]),
  addEvent
);

// Get all Events
router.get('/events', getAllEvents);

// Update Event
router.put(
  '/events/:id',
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'cardImage', maxCount: 1 },
  ]),
  updateEvent
);

// Delete Event
router.delete('/events/:id', deleteEvent);

module.exports = router;
