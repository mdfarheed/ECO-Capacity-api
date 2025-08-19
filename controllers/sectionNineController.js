const SectionNine = require('../models/SectionNine');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🔘 ADD Section Nine
exports.addSectionNine = async (req, res) => {
  try {
    const existing = await SectionNine.findOne();
    if (existing) return res.status(400).json({ message: 'Only one entry allowed' });

    const counter = await Counter.findOneAndUpdate(
      { name: 'sectionNineId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const mainImageFile = req.files?.mainImage?.[0];
    const itemImages = req.files?.images || [];

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(req.body.items || '[]');
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items' });
    }

    if (itemImages.length !== parsedItems.length) {
      return res.status(400).json({ message: 'Mismatch: itemImages must match items' });
    }

    const items = parsedItems.map((item, i) => ({
      heading: item.heading || '',
      paragraph: item.paragraph || '',
      imageUrl: itemImages[i]?.path || '',
      imagePublicId: itemImages[i]?.filename || '',
    }));

    const section = await SectionNine.create({
      id: counter.value,
      mainImageUrl: mainImageFile?.path || '',
      mainImagePublicId: mainImageFile?.filename || '',
      items,
    });

    res.status(201).json({ message: 'Section Nine created ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 🔁 UPDATE Section Nine
exports.updateSectionNine = async (req, res) => {
  try {
    const section = await SectionNine.findOne();
    if (!section) return res.status(404).json({ message: 'No entry found to update' });

    const mainImageFile = req.files?.mainImage?.[0];
    const itemImages = req.files?.images || [];

    let parsedItems = [];
    let parsedImageMeta = [];

    try {
      parsedItems = JSON.parse(req.body.items || '[]');
      parsedImageMeta = JSON.parse(req.body.imageMeta || '[]'); // Array of { index: number }
    } catch {
      return res.status(400).json({ message: 'Invalid JSON in items or imageMeta' });
    }

    const oldItems = section.items || [];

    // ✅ Map image to index
    const imageMap = {};
    parsedImageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') {
        imageMap[meta.index] = itemImages[i]; // index -> file
      }
    });

    // 🔄 Replace main image if sent
    if (mainImageFile) {
      if (section.mainImagePublicId) {
        await cloudinary.uploader.destroy(section.mainImagePublicId);
      }
      section.mainImageUrl = mainImageFile.path;
      section.mainImagePublicId = mainImageFile.filename;
    }

    // 🔁 Update items (old + new)
    section.items = await Promise.all(parsedItems.map(async (item, i) => {
      const oldItem = oldItems[i];
      const newImage = imageMap[i];

      // ✅ If image updated
      if (newImage) {
        if (oldItem?.imagePublicId) {
          await cloudinary.uploader.destroy(oldItem.imagePublicId);
        }
        return {
          heading: item.heading || '',
          paragraph: item.paragraph || '',
          imageUrl: newImage.path,
          imagePublicId: newImage.filename,
        };
      }

      // ✅ Retain old image or leave empty for new item
      return {
        heading: item.heading || '',
        paragraph: item.paragraph || '',
        imageUrl: oldItem?.imageUrl || '',
        imagePublicId: oldItem?.imagePublicId || '',
      };
    }));

    await section.save();
    res.status(200).json({ message: 'Section Nine updated ✅', section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};



// ❌ DELETE Section Nine
exports.deleteSectionNine = async (req, res) => {
  try {
    const section = await SectionNine.findOne();
    if (!section) return res.status(404).json({ message: 'No entry to delete' });

    // Delete all item images from cloudinary
    for (let item of section.items) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }
    }

    // Delete main image from cloudinary
    if (section.mainImagePublicId) {
      await cloudinary.uploader.destroy(section.mainImagePublicId);
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Section Nine deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};

// 📄 GET Section Nine
exports.getSectionNine = async (req, res) => {
  try {
    const section = await SectionNine.findOne();
    res.status(200).json({ section });
  } catch (err) {
    res.status(500).json({ message: 'Server Error 💥', error: err.message });
  }
};
