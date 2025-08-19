const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail'); // your existing function

// ✅ Subscribe
exports.subscribeUser = async (req, res) => {
  const { email } = req.body;

  try {
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Already subscribed' });
    }

    await Subscriber.create({ email });

    await sendEmail(
  email,
  'Thanks for Subscribing!',
  `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">🎉 Welcome to Our Newsletter!</h2>
        <p style="color: #555;">Hey there,</p>
        <p style="color: #555;">Thank you for subscribing! We'll keep you updated with latest blogs and events.</p>
        <p style="color: #555;">Stay tuned 🙌</p>
        <hr />
        <p style="font-size: 12px; color: gray;">If you did not subscribe, you can safely ignore this email.</p>
      </div>
    </body>
  </html>
  `
);


    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed', error: err.message });
  }
};

// ✅ Unsubscribe
exports.unsubscribeUser = async (req, res) => {
  const { email } = req.body;

  try {
    const deleted = await Subscriber.findOneAndDelete({ email });

    if (!deleted) {
      return res.status(404).json({ message: 'Email not found in subscriber list' });
    }

    await sendEmail(
      email,
      'You have been unsubscribed',
      `<p>You have successfully unsubscribed from our updates.</p>`
    );

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Unsubscribe failed', error: err.message });
  }
};

// unsubscribe form email button------------------
exports.unsubscribeFromLink = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const deleted = await Subscriber.findOneAndDelete({ email });

    if (!deleted) {
      return res.send(`<h2 style="font-family: sans-serif;">You are already unsubscribed or not found.</h2>`);
    }

    return res.send(`<h2 style="font-family: sans-serif;">You have successfully unsubscribed. You won't receive future notifications.</h2>`);
  } catch (error) {
    return res.status(500).send("Unsubscribe failed");
  }
};