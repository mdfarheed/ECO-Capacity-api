const Contact = require('../models/Contact');
const Counter = require('../models/Counter');

// @POST /api/contact
exports.contactUs = async (req, res) => {
  const { name, organization, email, message } = req.body;

  if (!name || !organization || !email || !message) {
    return res.status(400).json({ message: 'All fields are required ❌' });
  }

  try {
    let existingContact = await Contact.findOne({ email });

    if (existingContact) {
      // 🆕 Naya msg upar insert karna
      existingContact.messages.unshift({ message });
      await existingContact.save();

      return res.status(200).json({
        message: 'Message added to existing contact ✅',
        contact: existingContact,
      });
    } else {
      // 🧠 Custom ID
      let counter = await Counter.findOne({ name: 'contact_id' });
      if (!counter) {
        counter = await Counter.create({ name: 'contact_id', value: 1 });
      } else {
        counter.value += 1;
        await counter.save();
      }

      // 🆕 New contact with first message
      const newContact = await Contact.create({
        id: counter.value,
        name,
        organization,
        email,
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

// @GET /api/contact (latest contact first)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE /api/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ id: req.params.id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found ❌' });
    }

    res.status(200).json({ message: 'Contact deleted successfully ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
