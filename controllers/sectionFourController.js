const SectionFour = require('../models/SectionFour');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// ✅ Add Section Four
exports.addSectionFour = async (req, res) => {
  try {
    const existing = await SectionFour.findOne();
    if (existing) return res.status(400).json({ message: "Only one entry allowed" });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionFourId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const imageFile = req.files?.image?.[0];
    const iconFiles = req.files?.icons || [];

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(req.body.items || '[]');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON in items array' });
    }

    if (iconFiles.length !== parsedItems.length) {
      return res.status(400).json({ message: 'Mismatch: Number of icons must match number of items' });
    }

    const enrichedItems = parsedItems.map((item, i) => ({
      heading: item.heading || '',
      paragraph: item.paragraph || '',
      iconUrl: iconFiles[i]?.path || '',
      iconPublicId: iconFiles[i]?.filename || '',
    }));

    const section = await SectionFour.create({
      id: counter.value,
      subHeading: req.body.subHeading || '',
      mainHeading: req.body.mainHeading || '',
      subPara: req.body.subPara || '',
      mainPara: req.body.mainPara || '',
      imageUrl: imageFile?.path || '',
      imagePublicId: imageFile?.filename || '',
      items: enrichedItems,
    });

    res.status(201).json({ message: 'Section Four created ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// ✅ Get Section Four
exports.getSectionFour = async (req, res) => {
  try {
    const section = await SectionFour.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// ✅ Update Section Four
exports.updateSectionFour = async (req, res) => {
  try {
    const section = await SectionFour.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const imageFile = req.files?.image?.[0];
    const iconFiles = req.files?.icons || [];

    let parsedItems = [];
    let imageMeta = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
      imageMeta = JSON.parse(req.body.imageMeta || '[]'); // ✅ [{ index: 0 }, { index: 2 }]
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON in items or imageMeta' });
    }

    // ✅ Replace main image if provided
    if (imageFile) {
      if (section.imagePublicId) {
        await cloudinary.uploader.destroy(section.imagePublicId);
      }
      section.imageUrl = imageFile.path;
      section.imagePublicId = imageFile.filename;
    }

    // ✅ Map icons using index
    const imageMap = {};
    imageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') {
        imageMap[meta.index] = iconFiles[i];
      }
    });

    const oldItems = section.items || [];

    const newItems = await Promise.all(parsedItems.map(async (item, i) => {
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
    section.mainPara = req.body.mainPara || '';
    section.subPara = req.body.subPara || '';
    section.items = newItems;

    await section.save();
    res.status(200).json({ message: 'Section Four updated ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};


// ✅ Delete Section Four
exports.deleteSectionFour = async (req, res) => {
  try {
    const section = await SectionFour.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    for (let item of section.items) {
      if (item.iconPublicId) {
        await cloudinary.uploader.destroy(item.iconPublicId);
      }
    }

    if (section.imagePublicId) {
      await cloudinary.uploader.destroy(section.imagePublicId);
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Four deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};