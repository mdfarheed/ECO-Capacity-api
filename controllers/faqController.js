const Faq = require('../models/Faq');
const Counter = require('../models/Counter');

// @POST: Add FAQ
exports.addFaq = async (req, res) => {
  try {
    const { category, question, answer, order } = req.body || {};

    if (!category || !question || !answer) {
      return res.status(400).json({ message: 'category, question and answer are required' });
    }

    let counter = await Counter.findOne({ name: 'faq_custom_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'faq_custom_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    const faq = await Faq.create({
      id: counter.value,
      category,
      question,
      answer,
      order: order !== undefined && order !== "" ? Number(order) : 0,
    });

    res.status(201).json({ message: 'FAQ created ✅', faq });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT: Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer, order } = req.body || {};

    if (!category || !question || !answer) {
      return res.status(400).json({ message: 'category, question and answer are required' });
    }

    const faq = await Faq.findOne({ id });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    faq.category = category;
    faq.question = question;
    faq.answer = answer;
    faq.order = order !== undefined && order !== "" ? Number(order) : 0;

    await faq.save();

    res.status(200).json({ message: 'FAQ updated ✅', faq });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE: Delete FAQ
exports.deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await Faq.findOne({ id });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    await faq.deleteOne();

    res.status(200).json({ message: 'FAQ deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET: Get all FAQs (sorted by category, then order)
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ category: 1, order: 1 });
    res.status(200).json({ faqs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};