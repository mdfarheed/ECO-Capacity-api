const SectionSeven = require('../models/SectionSeven');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// ➕ Add
exports.addSectionSeven = async (req, res) => {
  try {
    const existing = await SectionSeven.findOne();
    if (existing) return res.status(400).json({ message: 'Only one entry allowed' });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionSevenId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const imageFile = req.file;

    const section = await SectionSeven.create({
      id: counter.value,
      subHeading: req.body.subHeading || '',
      mainHeading: req.body.mainHeading || '',
      para: req.body.para || '',
      imageUrl: imageFile?.path || '',
      imagePublicId: imageFile?.filename || ''
    });

    res.status(201).json({ message: 'Section Seven created ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 🔁 Update
exports.updateSectionSeven = async (req, res) => {
  try {
    const section = await SectionSeven.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const imageFile = req.file;

    if (imageFile) {
      if (section.imagePublicId) {
        await cloudinary.uploader.destroy(section.imagePublicId);
      }
      section.imageUrl = imageFile.path;
      section.imagePublicId = imageFile.filename;
    }

    section.subHeading = req.body.subHeading || '';
    section.mainHeading = req.body.mainHeading || '';
    section.para = req.body.para || '';

    await section.save();
    res.status(200).json({ message: 'Section Seven updated ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// ❌ Delete
exports.deleteSectionSeven = async (req, res) => {
  try {
    const section = await SectionSeven.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    if (section.imagePublicId) {
      await cloudinary.uploader.destroy(section.imagePublicId);
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Seven deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 📄 Get
exports.getSectionSeven = async (req, res) => {
  try {
    const section = await SectionSeven.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};
