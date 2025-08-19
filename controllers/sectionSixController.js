const SectionSix = require('../models/SectionSix');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// ✅ Add Section Six
exports.addSectionSix = async (req, res) => {
  try {
    const existing = await SectionSix.findOne();
    if (existing) return res.status(400).json({ message: "Only one entry allowed" });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionSixId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const files = req.files || [];
    let parsedItems = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items array' });
    }

    if (parsedItems.length !== files.length) {
      return res.status(400).json({ message: 'Mismatch: items and icons count must match' });
    }

    const enrichedItems = parsedItems.map((item, i) => ({
      heading: item.heading || '',
      paragraph: item.paragraph || '',
      iconUrl: files[i]?.path || '',
      iconPublicId: files[i]?.filename || '',
    }));

    const section = await SectionSix.create({
      id: counter.value,
      subHeading: req.body.subHeading || '',
      mainHeading: req.body.mainHeading || '',
      items: enrichedItems,
    });

    res.status(201).json({ message: 'Section Six created ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Get Section Six
exports.getSectionSix = async (req, res) => {
  try {
    const section = await SectionSix.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.updateSectionSix = async (req, res) => {
  try {
    const section = await SectionSix.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const files = req.files || []; // ✅ FIXED here
    let parsedItems = [];
    let imageMeta = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
      imageMeta = JSON.parse(req.body.imageMeta || '[]');
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items or imageMeta' });
    }

    const oldItems = section.items || [];

    const imageMap = {};
    imageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') {
        imageMap[meta.index] = files[i];
      }
    });

    const updatedItems = await Promise.all(parsedItems.map(async (item, i) => {
      const oldItem = oldItems[i] || {};
      const newFile = imageMap[i];

      if (newFile) {
        if (oldItem.iconPublicId) {
          await cloudinary.uploader.destroy(oldItem.iconPublicId);
        }

        return {
          heading: item.heading || '',
          paragraph: item.paragraph || '',
          iconUrl: newFile.path,
          iconPublicId: newFile.filename,
        };
      } else {
        return {
          heading: item.heading || '',
          paragraph: item.paragraph || '',
          iconUrl: oldItem.iconUrl || '',
          iconPublicId: oldItem.iconPublicId || '',
        };
      }
    }));

    section.mainHeading = req.body.mainHeading || '';
    section.subHeading = req.body.subHeading || '';
    section.items = updatedItems;

    await section.save();
    res.status(200).json({ message: 'Section Six updated ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};




// ✅ Delete Section Six
exports.deleteSectionSix = async (req, res) => {
  try {
    const section = await SectionSix.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    for (let item of section.items) {
      if (item.iconPublicId) await cloudinary.uploader.destroy(item.iconPublicId);
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Six deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
