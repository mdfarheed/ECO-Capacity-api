const Contact = require('../models/Contact');
const Counter = require('../models/Counter');

// @POST /api/contact
exports.contactUs = async (req, res) => {
  const { first_name, last_name, email, mobile, message } = req.body;

  try {
    const existingContact = await Contact.findOne({ email });

    if (existingContact) {
      // 🔁 Email exists: add new message
      existingContact.messages.push({ message });
      await existingContact.save();

      return res.status(200).json({
        message: 'Message added to existing contact ✅',
        contact: existingContact,
      });
    } else {
      // 🧠 Create custom ID
      let counter = await Counter.findOne({ name: 'contact_id' });
      if (!counter) {
        counter = await Counter.create({ name: 'contact_id', value: 1 });
      } else {
        counter.value += 1;
        await counter.save();
      }

      // 🆕 Create new contact
      const newContact = await Contact.create({
        id: counter.value,
        first_name,
        last_name,
        email,
        mobile,
        messages: [{ message }],
      });

      return res.status(201).json({
        message: 'New contact created successfully ✅',
        contact: newContact,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
