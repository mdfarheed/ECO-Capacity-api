const ThirdSection = require('../models/ThirdSection');
const Counter = require('../models/Counter');
const { cloudinary } = require('../config/cloudinary');

// 🔵 Add
exports.addThirdSection = async (req, res) => {
  try {
    const exists = await ThirdSection.findOne();
    if (exists) return res.status(400).json({ message: 'Section already exists' });

    const { heading, paragraph } = req.body;
    const items = JSON.parse(req.body.items || '[]'); // Expecting array in JSON format

    if (!heading || !paragraph || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid data submitted' });
    }

    const files = req.files || [];
    const enrichedItems = items.map((item, index) => {
      const file = files[index];
      return {
        heading: item.heading,
        paragraph: item.paragraph,
        iconUrl: file?.path || '',
        iconPublicId: file?.filename || '',
      };
    });

    const counter = await Counter.findOneAndUpdate(
      { name: 'thirdSection' },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );

    const section = await ThirdSection.create({
      id: counter.value,
      heading,
      paragraph,
      items: enrichedItems,
    });

    res.status(201).json({ message: 'Third section created ✅', section });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🟡 Update
exports.updateThirdSection = async (req, res) => {
  try {
    const section = await ThirdSection.findOne();
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const { heading, paragraph } = req.body;
    const parsedItems = JSON.parse(req.body.items || '[]');
    const imageMeta = JSON.parse(req.body.imageMeta || '[]'); // ✅ e.g., [{ index: 0 }, { index: 2 }]
    const iconFiles = req.files || [];

    // 🔄 Update top-level fields
    if (heading) section.heading = heading;
    if (paragraph) section.paragraph = paragraph;

    // ✅ Map icons by index
    const imageMap = {};
    imageMeta.forEach((meta, i) => {
      if (typeof meta.index === 'number') {
        imageMap[meta.index] = iconFiles[i];
      }
    });

    const oldItems = section.items || [];

    const updatedItems = await Promise.all(parsedItems.map(async (item, i) => {
      const oldItem = oldItems[i] || {};
      const newFile = imageMap[i];

      if (newFile) {
        // ✅ New file uploaded: delete old and use new
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
        // ✅ No new file: keep old image
        return {
          heading: item.heading || '',
          paragraph: item.paragraph || '',
          iconUrl: oldItem.iconUrl || '',
          iconPublicId: oldItem.iconPublicId || '',
        };
      }
    }));

    section.items = updatedItems;

    await section.save();
    res.status(200).json({ message: 'Third section updated ✅', section });
  } catch (error) {
    res.status(500).json({ message: 'Update failed 💥', error: error.message });
  }
};




// 🔴 Delete
exports.deleteThirdSection = async (req, res) => {
  try {
    const section = await ThirdSection.findOne(); // ❗ Single entry only
    if (!section) return res.status(404).json({ message: 'Section not found' });

    for (let item of section.items) {
      if (item.iconPublicId) {
        await cloudinary.uploader.destroy(item.iconPublicId);
      }
    }

    await section.deleteOne();
    res.status(200).json({ message: 'Third section deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};


// 📘 Get
exports.getThirdSection = async (req, res) => {
  try {
    const section = await ThirdSection.findOne();
    res.status(200).json({ section });
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};
