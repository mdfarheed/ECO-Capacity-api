const SeoMeta = require('../models/SeoMeta');
const RobotsTxt = require('../models/RobotsTxt');
const { cloudinary } = require('../config/cloudinary');

// 🔹 GET ALL SEO
exports.getAllMeta = async (req, res) => {
  const all = await SeoMeta.find();
  res.json(all);
};

// 🔹 GET ONE
exports.getMetaByPage = async (req, res) => {
  const meta = await SeoMeta.findOne({ page: req.params.page });
  if (!meta) return res.status(404).json({ message: "SEO data not found" });
  res.json(meta);
};

// 🔵 ADD SEO Meta
exports.addSeoMeta = async (req, res) => {
  try {
    const {
      page, title, description, keywords, canonical,
      ogTitle, ogDescription, ogUrl,
      twitterTitle, twitterDescription
    } = req.body;

    if (!page || !title || !description) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const exists = await SeoMeta.findOne({ page });
    if (exists) {
      return res.status(400).json({ message: `Meta for "${page}" already exists` });
    }

    const newMeta = new SeoMeta({
      page, title, description, keywords, canonical,
      ogTitle, ogDescription, ogUrl,
      twitterTitle, twitterDescription
    });

    if (req.files?.ogImage) {
      newMeta.ogImageUrl = req.files.ogImage[0].path;
      newMeta.ogImagePublicId = req.files.ogImage[0].filename;
    }

    if (req.files?.twitterImage) {
      newMeta.twitterImageUrl = req.files.twitterImage[0].path;
      newMeta.twitterImagePublicId = req.files.twitterImage[0].filename;
    }

    if (req.files?.favicon) {
      newMeta.faviconUrl = req.files.favicon[0].path;
      newMeta.faviconPublicId = req.files.favicon[0].filename;
    }

    await newMeta.save();
    res.status(201).json({ message: 'SEO Meta created ✅', meta: newMeta });

  } catch (error) {
    res.status(500).json({ message: 'Add failed', error: error.message });
  }
};

// 🟡 UPDATE SEO Meta
exports.updateSeoMeta = async (req, res) => {
  try {
    const { page } = req.params;
    if (!page) return res.status(400).json({ message: 'Page name is required' });

    const meta = await SeoMeta.findOne({ page });
    if (!meta) return res.status(404).json({ message: `Meta for "${page}" not found` });

    const fields = ['title', 'description', 'keywords', 'canonical', 'ogTitle', 'ogDescription', 'ogUrl', 'twitterTitle', 'twitterDescription'];

    fields.forEach(field => {
      if (req.body[field]) meta[field] = req.body[field];
    });

    if (req.files?.ogImage) {
      if (meta.ogImagePublicId) await cloudinary.uploader.destroy(meta.ogImagePublicId);
      meta.ogImageUrl = req.files.ogImage[0].path;
      meta.ogImagePublicId = req.files.ogImage[0].filename;
    }

    if (req.files?.twitterImage) {
      if (meta.twitterImagePublicId) await cloudinary.uploader.destroy(meta.twitterImagePublicId);
      meta.twitterImageUrl = req.files.twitterImage[0].path;
      meta.twitterImagePublicId = req.files.twitterImage[0].filename;
    }

    if (req.files?.favicon) {
      if (meta.faviconPublicId) await cloudinary.uploader.destroy(meta.faviconPublicId);
      meta.faviconUrl = req.files.favicon[0].path;
      meta.faviconPublicId = req.files.favicon[0].filename;
    }

    await meta.save();
    res.status(200).json({ message: 'SEO Meta updated ✅', meta });

  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};


// 🔴 DELETE SEO Meta
exports.deleteMeta = async (req, res) => {
  const meta = await SeoMeta.findOne({ page: req.params.page });
  if (!meta) return res.status(404).json({ message: "SEO data not found" });

  if (meta.ogImagePublicId) await cloudinary.uploader.destroy(meta.ogImagePublicId);
  if (meta.twitterImagePublicId) await cloudinary.uploader.destroy(meta.twitterImagePublicId);
  if (meta.faviconPublicId) await cloudinary.uploader.destroy(meta.faviconPublicId);

  await SeoMeta.deleteOne({ _id: meta._id });
  res.json({ message: "SEO Meta deleted ✅" });
};

// 🟢 ROBOTS.TXT
exports.getRobotsTxt = async (req, res) => {
  const robots = await RobotsTxt.findOne();
  res.type('text/plain').send(robots?.content || '');
};

exports.updateRobotsTxt = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Content is required" });

  await RobotsTxt.deleteMany();
  const newData = new RobotsTxt({ content });
  await newData.save();

  res.json({ message: "robots.txt updated" });
};

// 🟣 SITEMAP.XML
exports.generateSitemap = async (req, res) => {
  const metas = await SeoMeta.find();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  metas.forEach(meta => {
    xml += `  <url>\n    <loc>http://94.136.191.54/${meta.page}</loc>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.header("Content-Type", "application/xml");
  res.send(xml);
};
