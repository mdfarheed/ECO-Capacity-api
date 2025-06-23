const SectionOne = require('../models/SectionOne');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🟢 Add Section One
exports.addSectionOne = async (req, res) => {
  try {
    const exists = await SectionOne.findOne();
    if (exists) return res.status(400).json({ message: 'Section One already exists' });
    const { heading, para } = req.body;
    if (!heading || !para || !req.file) {
      return res.status(400).json({ message: 'All fields and image are required' });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionOne' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newSection = await SectionOne.create({
      id: counter.value,
      heading,
      para,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    res.status(201).json({ message: 'Section One created ✅', section: newSection });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🟡 Update Section One
exports.updateSectionOne = async (req, res) => {
  try {
    const section = await SectionOne.findOne();
    if (!section) return res.status(404).json({ message: 'No Section One found' });

    const { heading, para } = req.body;

    if (heading) section.heading = heading;
    if (para) section.para = para;

    if (req.file) {
      if (section.imagePublicId) {
        await cloudinary.uploader.destroy(section.imagePublicId);
      }
      section.imageUrl = req.file.path;
      section.imagePublicId = req.file.filename;
    }

    await section.save();
    res.status(200).json({ message: 'Section One updated ✅', section });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// 🔴 Delete Section One
exports.deleteSectionOne = async (req, res) => {
  try {
    const section = await SectionOne.findOne();
    if (!section) return res.status(404).json({ message: 'No Section One found' });

    if (section.imagePublicId) {
      await cloudinary.uploader.destroy(section.imagePublicId);
    }

    await SectionOne.deleteOne({ _id: section._id });
    res.status(200).json({ message: 'Section One deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

// 🔍 Get Section One
exports.getSectionOne = async (req, res) => {
  try {
    const section = await SectionOne.findOne();
    if (!section) return res.status(404).json({ message: 'No Section One found' });

    res.status(200).json({ section });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
