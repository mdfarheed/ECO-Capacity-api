const SectionFifth = require('../models/SectionFifth');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// Utility to extract array fields
const extractFiles = (filesObj) => {
  return {
    images: filesObj?.images || [],
    icons: filesObj?.icons || [],
  };
};

// ✅ Add Section Five
exports.addSectionFifth = async (req, res) => {
  try {
    const existing = await SectionFifth.findOne();
    if (existing) return res.status(400).json({ message: "Only one entry allowed" });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionFiveId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const { images, icons } = extractFiles(req.files || []);
    let parsedItems = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items array' });
    }

    if (parsedItems.length !== images.length || parsedItems.length !== icons.length) {
      return res.status(400).json({
        message: 'Mismatch: items, images, and icons count must match',
      });
    }

    const enrichedItems = parsedItems.map((item, i) => ({
      heading: item.heading || '',
      paragraph: item.paragraph || '',
      imageUrl: images[i]?.path || null,
      imagePublicId: images[i]?.filename || null,
      iconUrl: icons[i]?.path || null,
      iconPublicId: icons[i]?.filename || null,
    }));

    const section = await SectionFifth.create({
      id: counter.value,
      subHeading: req.body.subHeading || '',
      mainHeading: req.body.mainHeading || '',
      para: req.body.para || '',
      items: enrichedItems,
    });

    res.status(201).json({ message: 'Section Five created ✅', section });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Get Section Five
exports.getSectionFifth = async (req, res) => {
  try {
    const section = await SectionFifth.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Update Section Five
exports.updateSectionFifth = async (req, res) => {
  try {
    const section = await SectionFifth.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const images = req.files?.images || [];
    const icons = req.files?.icons || [];

    let parsedItems = [];
    let imageMeta = [];
    let iconMeta = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
      imageMeta = JSON.parse(req.body.imageMeta || '[]'); // [{ index: 0 }, { index: 3 }]
      iconMeta = JSON.parse(req.body.iconMeta || '[]');   // [{ index: 1 }, { index: 2 }]
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items or meta arrays' });
    }

    // ✅ Map image/icon files to their index
    const imageMap = {};
    const iconMap = {};
    imageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') imageMap[meta.index] = images[i];
    });
    iconMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') iconMap[meta.index] = icons[i];
    });

    const oldItems = section.items || [];

    const updatedItems = await Promise.all(parsedItems.map(async (item, i) => {
      const oldItem = oldItems[i] || {};

      const newImage = imageMap[i];
      const newIcon = iconMap[i];

      // Image logic
      let imageObj = {
        imageUrl: oldItem.imageUrl || '',
        imagePublicId: oldItem.imagePublicId || '',
      };

      if (newImage) {
        if (oldItem.imagePublicId) {
          await cloudinary.uploader.destroy(oldItem.imagePublicId);
        }
        imageObj = {
          imageUrl: newImage.path,
          imagePublicId: newImage.filename,
        };
      }

      // Icon logic
      let iconObj = {
        iconUrl: oldItem.iconUrl || '',
        iconPublicId: oldItem.iconPublicId || '',
      };

      if (newIcon) {
        if (oldItem.iconPublicId) {
          await cloudinary.uploader.destroy(oldItem.iconPublicId);
        }
        iconObj = {
          iconUrl: newIcon.path,
          iconPublicId: newIcon.filename,
        };
      }

      return {
        heading: item.heading || '',
        paragraph: item.paragraph || '',
        ...imageObj,
        ...iconObj,
      };
    }));

    section.subHeading = req.body.subHeading || '';
    section.mainHeading = req.body.mainHeading || '';
    section.para = req.body.para || '';
    section.items = updatedItems;

    await section.save();
    res.status(200).json({ message: 'Section Five updated ✅', section });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};


// ✅ Delete Section Five
exports.deleteSectionFifth = async (req, res) => {
  try {
    const section = await SectionFifth.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    for (let item of section.items) {
      if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);
      if (item.iconPublicId) await cloudinary.uploader.destroy(item.iconPublicId);
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Five deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
