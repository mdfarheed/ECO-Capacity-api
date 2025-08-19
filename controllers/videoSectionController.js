const VideoSection = require('../models/VideoSection');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🔵 Add Video Section (Max 2 entries)
exports.addVideoSection = async (req, res) => {
  try {
    const count = await VideoSection.countDocuments();
    if (count >= 2) return res.status(400).json({ message: 'Maximum 2 video sections allowed' });

    const { heading } = req.body;
    if (!heading || !req.file) {
      return res.status(400).json({ message: 'Heading and video are required' });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'videoSection' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newSection = await VideoSection.create({
      id: counter.value,
      heading,
      videoUrl: req.file.path,
      videoPublicId: req.file.filename,
    });

    res.status(201).json({ message: 'Video Section added ✅', section: newSection });
  } catch (error) {
    res.status(500).json({ message: 'Add failed', error: error.message });
  }
};

// 🟡 Update Video Section
exports.updateVideoSection = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await VideoSection.findOne({ id });
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const { heading } = req.body;
    if (heading) section.heading = heading;

    if (req.file) {
      if (section.videoPublicId) {
        await cloudinary.uploader.destroy(section.videoPublicId);
      }
      section.videoUrl = req.file.path;
      section.videoPublicId = req.file.filename;
    }

    await section.save();
    res.status(200).json({ message: 'Video Section updated ✅', section });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// 🔴 Delete Video Section
exports.deleteVideoSection = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await VideoSection.findOne({ id });
    if (!section) return res.status(404).json({ message: 'Section not found' });

    if (section.videoPublicId) {
      await cloudinary.uploader.destroy(section.videoPublicId);
    }

    await VideoSection.deleteOne({ _id: section._id });
    res.status(200).json({ message: 'Video Section deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

// 📗 Get All Video Sections
exports.getAllVideoSections = async (req, res) => {
  try {
    const sections = await VideoSection.find();
    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};
