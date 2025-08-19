const Hero = require('../models/Hero');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🔹 ADD Hero Section
exports.addHero = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or unsupported format" });
    }

    const existing = await Hero.findOne();
    if (existing) {
      return res.status(400).json({ message: "Hero section already exists. Please update instead." });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'heroId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const hero = await Hero.create({
      id: counter.value,
      bannerVedioUrl: req.file.path,
      bannerVedioPublicId: req.file.filename,
      bannerHeading: req.body.bannerHeading || '',
      bannerPara: req.body.bannerPara || '',
    });

    res.status(201).json({ message: 'Hero section added ✅', hero });
  } catch (error) {
    console.error("Add Hero Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔁 UPDATE Hero
exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "No Hero section found" });

    if (req.file) {
      // 🧠 Detect old media type
      const isVideo = hero.bannerVedioUrl?.includes('.mp4') || hero.bannerVedioUrl?.includes('.webm') || hero.bannerVedioUrl?.includes('.mov');

      await cloudinary.uploader.destroy(
        `website_sections/${hero.bannerVedioPublicId}`,
        { resource_type: isVideo ? 'video' : 'image' }
      );

      hero.bannerVedioUrl = req.file.path;
      hero.bannerVedioPublicId = req.file.filename;
    }

    if (req.body.bannerHeading !== undefined) hero.bannerHeading = req.body.bannerHeading;
    if (req.body.bannerPara !== undefined) hero.bannerPara = req.body.bannerPara;

    await hero.save();
    res.status(200).json({ message: 'Hero section updated ✅', hero });
  } catch (error) {
    console.error("Update Hero Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ❌ DELETE Hero
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "No Hero section to delete" });

    const isVideo = hero.bannerVedioUrl?.includes('.mp4') || hero.bannerVedioUrl?.includes('.webm') || hero.bannerVedioUrl?.includes('.mov');

    await cloudinary.uploader.destroy(
      `website_sections/${hero.bannerVedioPublicId}`,
      { resource_type: isVideo ? 'video' : 'image' }
    );

    await hero.deleteOne();
    res.status(200).json({ message: "Hero section deleted ✅" });
  } catch (error) {
    console.error("Delete Hero Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📦 GET Hero
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "No Hero section found" });
    res.status(200).json({ hero });
  } catch (error) {
    console.error("Get Hero Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
