const Subscriber = require('../models/Subscriber');
const sendEmail = require('./sendEmail');
const NotificationLog = require('../models/NotificationLog');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const truncate = (text = '', maxLength = 100) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// 🔔 BLOG Notification
exports.notifyNewBlog = async (blog) => {
  const subscribers = await Subscriber.find();

  for (let i = 0; i < subscribers.length; i += 100) {
    const batch = subscribers.slice(i, i + 100);

    await Promise.all(
      batch.map(async (user) => {
        // Check if already notified
        const alreadySent = await NotificationLog.findOne({
          subscriberEmail: user.email,
          type: 'blog',
          contentId: blog.id,
        });

        if (alreadySent) return;

        const html = `
          <div style="font-family: Arial; background: #f8f8f8; padding: 20px;">
            <div style="background: #fff; padding: 15px; border-radius: 8px;">
              <img src="${blog.imageUrl}" alt="${blog.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 5px;" />
              <p style="font-size: 14px; margin-top: 10px; color: #666;">By ${blog.author} on ${blog.date}</p>
              <h2 style="color: #333;">${blog.title}</h2>
              <p style="color: #555;">${truncate(blog.content2, 120)}</p>
              <a href="http://94.136.191.54/blogs/${blog.id}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #8A85C9; color: white; text-decoration: none; border-radius: 5px;">Read More</a>
              <hr style="margin: 20px 0;" />
             <p style="text-align: center; font-size: 13px; color: #888;">
  Don't want to receive these emails?
  <a href="http://94.136.191.54/api/api/unsubscribeToEmail?email=${encodeURIComponent(user.email)}" style="color: #FF5252;">Unsubscribe</a>
</p>

            </div>
          </div>
        `;

        await sendEmail(user.email, `📚 New Blog: ${blog.title}`, html);

        await NotificationLog.create({
          subscriberEmail: user.email,
          type: 'blog',
          contentId: blog.id,
        });
      })
    );

    if (i + 100 < subscribers.length) await delay(2 * 60 * 1000);
  }
};

// 🔔 EVENT Notification
exports.notifyNewEvent = async (event) => {
  const subscribers = await Subscriber.find();

  for (let i = 0; i < subscribers.length; i += 100) {
    const batch = subscribers.slice(i, i + 100);

    await Promise.all(
      batch.map(async (user) => {
        const alreadySent = await NotificationLog.findOne({
          subscriberEmail: user.email,
          type: 'event',
          contentId: event.id,
        });

        if (alreadySent) return;

        const html = `
          <div style="font-family: Arial; background: #f8f8f8; padding: 20px;">
            <div style="background: #fff; padding: 15px; border-radius: 8px;">
              <img src="${event.cardImageUrl}" alt="${event.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 5px;" />
              <p style="font-size: 14px; margin-top: 10px; color: #666;">📍 ${event.location} | 📅 ${event.date}</p>
              <h2 style="color: #333;">${event.title}</h2>
              <p style="color: #555;">${truncate(event.description, 100)}</p>
              <a href="http://94.136.191.54/event/${event.id}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #A48CF0; color: white; text-decoration: none; border-radius: 5px;">Book Now</a>
              <hr style="margin: 20px 0;" />
              <p style="text-align: center; font-size: 13px; color: #888;">
  Don't want to receive these emails?
  <a href="http://94.136.191.54/api/api/unsubscribeToEmail?email=${encodeURIComponent(user.email)}" style="color: #FF5252;">Unsubscribe</a>
</p>

            </div>
          </div>
        `;

        await sendEmail(user.email, `🎉 New Event: ${event.title}`, html);

        await NotificationLog.create({
          subscriberEmail: user.email,
          type: 'event',
          contentId: event.id,
        });
      })
    );

    if (i + 100 < subscribers.length) await delay(2 * 60 * 1000);
  }
};
