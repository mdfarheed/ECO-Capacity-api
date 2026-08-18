const FeaturedResearch = require('../models/FeaturedResearch');
const { cloudinary } = require('../config/cloudinary');
const Counter = require('../models/Counter');
const slugify = require('../utils/slugify');

// generate a unique slug (appends -2, -3 ... if title repeats)
const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query.id = { $ne: excludeId };

    const existing = await FeaturedResearch.findOne(query);
    if (!existing) break;

    count += 1;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
};

// @POST: Add research
exports.addResearch = async (req, res) => {
  const { title, subtitle, type, shortDescription, audience, tags, source, date, fullDescription } = req.body;

  try {
    let counter = await Counter.findOne({ name: 'research_custom_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'research_custom_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const slug = await generateUniqueSlug(title);

    const tagsArray = Array.isArray(tags)
      ? tags
      : (tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    const research = await FeaturedResearch.create({
      id: counter.value,
      title,
      subtitle: subtitle || "", // 👈 optional
      slug,
      type,
      shortDescription,
      audience,
      tags: tagsArray,
      source,
      date,
      fullDescription,
      imageUrl: req.file ? req.file.path : '',
      imagePublicId: req.file ? req.file.filename : '',
    });

    res.status(201).json({ message: 'Research created ✅', research });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT: Update research
exports.updateResearch = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, type, shortDescription, audience, tags, source, date, fullDescription } = req.body;

  try {
    const research = await FeaturedResearch.findOne({ id });
    if (!research) return res.status(404).json({ message: 'Research not found' });

    if (req.file) {
      if (research.imagePublicId) {
        await cloudinary.uploader.destroy(research.imagePublicId);
      }
      research.imageUrl = req.file.path;
      research.imagePublicId = req.file.filename;
    }

    if (title && title !== research.title) {
      research.slug = await generateUniqueSlug(title, research.id);
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : (tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    research.title = title;
    research.subtitle = subtitle || ""; // 👈 optional
    research.type = type;
    research.shortDescription = shortDescription;
    research.audience = audience;
    research.tags = tagsArray;
    research.source = source;
    research.date = date;
    research.fullDescription = fullDescription;

    await research.save();

    res.status(200).json({ message: 'Research updated ✅', research });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE: Delete research
exports.deleteResearch = async (req, res) => {
  const { id } = req.params;

  try {
    const research = await FeaturedResearch.findOne({ id });
    if (!research) return res.status(404).json({ message: 'Research not found' });

    if (research.imagePublicId) {
      await cloudinary.uploader.destroy(research.imagePublicId);
    }
    await research.deleteOne();

    res.status(200).json({ message: 'Research deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET: Get all research
exports.getAllResearch = async (req, res) => {
  try {
    const research = await FeaturedResearch.find().sort({ id: -1 });
    res.status(200).json({ research });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET: Get single research by slug (for detail page)
exports.getResearchBySlug = async (req, res) => {
  try {
    const research = await FeaturedResearch.findOne({ slug: req.params.slug });
    if (!research) return res.status(404).json({ message: 'Research not found' });
    res.status(200).json({ research });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};