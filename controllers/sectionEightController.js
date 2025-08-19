const SectionEight = require('../models/SectionEight');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🔘 ADD Section Eight
exports.addSectionEight = async (req, res) => {
  try {
    const existing = await SectionEight.findOne();
    if (existing) return res.status(400).json({ message: 'Only one entry allowed' });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionEightId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const itemImages = req.files?.images || [];

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(req.body.items || '[]');
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items' });
    }

    if (itemImages.length !== parsedItems.length) {
      return res.status(400).json({ message: 'Mismatch: images and items count' });
    }

    const items = parsedItems.map((item, i) => ({
  imageUrl: itemImages[i]?.path || '',
  imagePublicId: itemImages[i]?.filename || '',
  designation: item.designation || '',
  catagory: item.catagory || '', // ✅ new field
  name: item.name || '',
  subDescription: item.subDescription || '',
  fullDescription: item.fullDescription || '',
}));


    const section = await SectionEight.create({
      id: counter.value,
      heading: req.body.heading || '',
      subHeading: req.body.subHeading || '',
      para: req.body.para || '',
      items,
    });

    res.status(201).json({ message: 'Section Eight created ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 🔁 UPDATE Section Eight
exports.updateSectionEight = async (req, res) => {
  try {
    const section = await SectionEight.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const files = req.files?.images || [];

    let parsedItems = [];
    let parsedImageMeta = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
      parsedImageMeta = JSON.parse(req.body.imageMeta || '[]'); // Array of { index: number }
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items or imageMeta' });
    }

    const oldItems = section.items || [];

    // 🧠 Map image by index
    const imageMap = {};
    parsedImageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') {
        imageMap[meta.index] = files[i]; // files order matches meta array
      }
    });

    // 🔄 Create new items
    const newItems = await Promise.all(parsedItems.map(async (item, i) => {
      const newImage = imageMap[i];
      const oldItem = oldItems[i];

      // 🟢 New item (not previously existing)
      const isNew = !oldItem;

      if (newImage) {
        if (oldItem?.imagePublicId) {
          await cloudinary.uploader.destroy(oldItem.imagePublicId);
        }

        return {
          imageUrl: newImage.path,
          imagePublicId: newImage.filename,
          designation: item.designation || '',
          catagory: item.catagory || '',
          name: item.name || '',
          subDescription: item.subDescription || '',
          fullDescription: item.fullDescription || '',
        };
      }

      // ❌ No new image
      if (isNew) {
        return {
          imageUrl: '',
          imagePublicId: '',
          designation: item.designation || '',
          catagory: item.catagory || '',
          name: item.name || '',
          subDescription: item.subDescription || '',
          fullDescription: item.fullDescription || '',
        };
      }

      // ✅ Use old image
      return {
        imageUrl: oldItem?.imageUrl || '',
        imagePublicId: oldItem?.imagePublicId || '',
        designation: item.designation || '',
        catagory: item.catagory || '',
        name: item.name || '',
        subDescription: item.subDescription || '',
        fullDescription: item.fullDescription || '',
      };
    }));

    // 📝 Save other data
    section.heading = req.body.heading || '';
    section.subHeading = req.body.subHeading || '';
    section.para = req.body.para || '';
    section.items = newItems;

    await section.save();
    res.status(200).json({ message: 'Section Eight updated ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};




// ❌ DELETE Section Eight
exports.deleteSectionEight = async (req, res) => {
  try {
    const section = await SectionEight.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    for (let item of section.items) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Eight deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 📄 GET Section Eight
exports.getSectionEight = async (req, res) => {
  try {
    const section = await SectionEight.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};
