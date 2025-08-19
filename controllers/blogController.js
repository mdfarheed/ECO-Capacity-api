const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinary');
const { notifyNewBlog } = require('../utils/notifySubscribers');
const Counter = require('../models/Counter');

// @POST: Add blog
exports.addBlog = async (req, res) => {
  const { title, title2, author, date, content1, content2, catagory } = req.body; // ✅ catagory included

  try {
    let counter = await Counter.findOne({ name: 'blog_custom_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'blog_custom_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const blog = await Blog.create({
      id: counter.value,
      title,
      title2,
      author,
      date,
      content1,
      content2,
      catagory, // ✅ include this
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    // Notify Subscribers once per subscriber per blog
    await notifyNewBlog(blog);

    res.status(201).json({ message: 'Blog created ✅', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT: Update blog
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, title2, author, date, content1, content2, catagory } = req.body;

  try {
    const blog = await Blog.findOne({ id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.file) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
      blog.imageUrl = req.file.path;
      blog.imagePublicId = req.file.filename;
    }

    blog.title = title;
    blog.title2 = title2;
    blog.author = author;
    blog.date = date;
    blog.content1 = content1;
    blog.content2 = content2;
    blog.catagory = catagory; // ✅ update catagory too

    await blog.save();

    res.status(200).json({ message: 'Blog updated ✅', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// @DELETE: Delete blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params; // custom id

  try {
    const blog = await Blog.findOne({ id }); // 👈 custom id
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await cloudinary.uploader.destroy(blog.imagePublicId);
    await blog.deleteOne();

    res.status(200).json({ message: 'Blog deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @GET: Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
