const Article = require('../models/Article');
const { cloudinary } = require('../config/cloudinary');
const Counter = require('../models/Counter');

// @POST: Add article
exports.addArticle = async (req, res) => {
  const { title, category, icon, source, author, date, content1, content2 } = req.body;

  try {
    let counter = await Counter.findOne({ name: 'article_custom_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'article_custom_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const article = await Article.create({
      id: counter.value,
      title,
      category,
      icon,
      source,
      author,
      date,
      content1,
      content2,
      imageUrl: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
    });

    res.status(201).json({ message: 'Article created ✅', article });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT: Update article
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, category, icon, source, author, date, content1, content2 } = req.body;

  try {
    const article = await Article.findOne({ id });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (req.file) {
      if (article.imagePublicId) {
        await cloudinary.uploader.destroy(article.imagePublicId);
      }
      article.imageUrl = req.file.path;
      article.imagePublicId = req.file.filename;
    }

    article.title = title;
    article.category = category;
    article.icon = icon;
    article.source = source;
    article.author = author;
    article.date = date;
    article.content1 = content1;
    article.content2 = content2;

    await article.save();

    res.status(200).json({ message: 'Article updated ✅', article });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE: Delete article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findOne({ id });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.imagePublicId) {
      await cloudinary.uploader.destroy(article.imagePublicId);
    }
    await article.deleteOne();

    res.status(200).json({ message: 'Article deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET: Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ id: -1 });
    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};