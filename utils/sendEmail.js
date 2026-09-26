const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html, options = {}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === 'true',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ECO Capacity Exchange" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    ...options,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;