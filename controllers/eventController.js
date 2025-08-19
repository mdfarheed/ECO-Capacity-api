const Event = require('../models/Event');
const Counter = require('../models/Counter');
const {notifyNewEvent } = require('../utils/notifySubscribers');
const NotificationLog = require('../models/NotificationLog');
const { cloudinary } = require('../config/cloudinary');

// @POST: Add Event
exports.addEvent = async (req, res) => {
  try {
    const { location, date, map, title, tags, description } = req.body;

    // Handle Counter for custom id
    let counter = await Counter.findOne({ name: 'event_custom_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'event_custom_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const event = await Event.create({
      id: counter.value,
      location,
      date,
      map,
      title,
      tags: JSON.parse(tags), // expect array from frontend (stringified)
      description,
      bannerImageUrl: req.files['bannerImage'][0].path,
      bannerImagePublicId: req.files['bannerImage'][0].filename,
      cardImageUrl: req.files['cardImage'][0].path,
      cardImagePublicId: req.files['cardImage'][0].filename,
    });

    // Notify Subscribers once per subscriber per event
    await notifyNewEvent(event);

    res.status(201).json({ message: 'Event created ✅', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @GET: All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @PUT: Update Event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { location, date, map, title, tags, description, bannerImageUrl, cardImageUrl } = req.body;

  try {
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Handle banner image replacement
    if (req.files['bannerImage']) {
      await cloudinary.uploader.destroy(event.bannerImagePublicId);
      event.bannerImageUrl = req.files['bannerImage'][0].path;
      event.bannerImagePublicId = req.files['bannerImage'][0].filename;
    } else if (bannerImageUrl) {
      event.bannerImageUrl = bannerImageUrl;
    }

    // Handle card image replacement
    if (req.files['cardImage']) {
      await cloudinary.uploader.destroy(event.cardImagePublicId);
      event.cardImageUrl = req.files['cardImage'][0].path;
      event.cardImagePublicId = req.files['cardImage'][0].filename;
    } else if (cardImageUrl) {
      event.cardImageUrl = cardImageUrl;
    }

    // Update text fields
    event.location = location;
    event.title = title;
    event.date = date;
    event.map = map;
    event.tags = JSON.parse(tags);
    event.description = description;

    await event.save();
    res.status(200).json({ message: 'Event updated ✅', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @DELETE: Delete Event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await cloudinary.uploader.destroy(event.bannerImagePublicId);
    await cloudinary.uploader.destroy(event.cardImagePublicId);
    await event.deleteOne();

    res.status(200).json({ message: 'Event deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
