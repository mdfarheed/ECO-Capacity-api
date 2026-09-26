const Contact = require('../models/Contact');
const Counter = require('../models/Counter');
const sendEmail = require('../utils/sendEmail');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'farheedsaifi7500@gmail.com';

const ADMIN_CONTACT_URL =
  'http://localhost:5173/admin?section=contact';


// =====================================================
// HTML ESCAPE
// =====================================================

const escapeHtml = (value = '') => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};


// =====================================================
// POST /api/contact
// =====================================================

exports.contactUs = async (req, res) => {
  const { name, organization, email, message } = req.body;

  if (!name || !organization || !email || !message) {
    return res.status(400).json({
      message: 'All fields are required ❌',
    });
  }

  try {
    let existingContact = await Contact.findOne({ email });

    let savedContact;

    // =================================================
    // EXISTING CONTACT
    // =================================================

    if (existingContact) {
      existingContact.messages.unshift({
        message,
      });

      await existingContact.save();

      savedContact = existingContact;
    }

    // =================================================
    // NEW CONTACT
    // =================================================

    else {
      let counter = await Counter.findOne({
        name: 'contact_id',
      });

      if (!counter) {
        counter = await Counter.create({
          name: 'contact_id',
          value: 1,
        });
      } else {
        counter.value += 1;
        await counter.save();
      }

      const newContact = await Contact.create({
        id: counter.value,
        name,
        organization,
        email,
        messages: [
          {
            message,
          },
        ],
      });

      savedContact = newContact;
    }


    // =================================================
    // SAFE HTML VALUES
    // =================================================

    const safeName = escapeHtml(name);
    const safeOrganization = escapeHtml(organization);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);


    // =================================================
    // USER CONFIRMATION EMAIL
    // =================================================

    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Contact Request Received</title>
        </head>

        <body style="
          margin: 0;
          padding: 30px;
          background: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 3px 15px rgba(0,0,0,0.08);
          ">

            <div style="
              background: #2F336D;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 24px;
              ">
                ECO Capacity Exchange
              </h1>
            </div>

            <div style="padding: 30px;">

              <h2 style="
                color: #333333;
                margin-top: 0;
              ">
                Thank you for contacting us!
              </h2>

              <p style="
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
              ">
                Hi ${safeName},
              </p>

              <p style="
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
              ">
                We have received your enquiry successfully.
                Our team will review your message and get back to you
                as soon as possible.
              </p>

              <div style="
                background: #f7f7f7;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
              ">

                <p style="margin: 5px 0;">
                  <strong>Name:</strong> ${safeName}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Organisation:</strong> ${safeOrganization}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Email:</strong> ${safeEmail}
                </p>

                <p style="margin: 15px 0 5px;">
                  <strong>Your Message:</strong>
                </p>

                <p style="
                  margin: 5px 0;
                  color: #555;
                  line-height: 1.6;
                ">
                  ${safeMessage}
                </p>

              </div>

              <p style="
                color: #777777;
                font-size: 13px;
                margin-top: 25px;
              ">
                This is an automated confirmation email from
                ECO Capacity Exchange.
              </p>

            </div>

            <div style="
              background: #f5f5f5;
              padding: 15px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              © ${new Date().getFullYear()} ECO Capacity Exchange
            </div>

          </div>

        </body>
      </html>
    `;


    // =================================================
    // ADMIN NOTIFICATION EMAIL
    // =================================================

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>New Contact Enquiry</title>
        </head>

        <body style="
          margin: 0;
          padding: 30px;
          background: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 650px;
            margin: auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 3px 15px rgba(0,0,0,0.08);
          ">

            <div style="
              background: #2F336D;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 24px;
              ">
                New Contact Enquiry
              </h1>
            </div>

            <div style="padding: 30px;">

              <h2 style="
                color: #333333;
                margin-top: 0;
              ">
                You have received a new enquiry
              </h2>

              <div style="
                background: #f7f7f7;
                padding: 20px;
                border-radius: 8px;
              ">

                <p style="margin: 8px 0;">
                  <strong>Name:</strong> ${safeName}
                </p>

                <p style="margin: 8px 0;">
                  <strong>Organisation:</strong> ${safeOrganization}
                </p>

                <p style="margin: 8px 0;">
                  <strong>Email:</strong> ${safeEmail}
                </p>

                <p style="
                  margin: 20px 0 8px;
                ">
                  <strong>Message:</strong>
                </p>

                <div style="
                  background: #ffffff;
                  border: 1px solid #eeeeee;
                  padding: 15px;
                  border-radius: 6px;
                  color: #555555;
                  line-height: 1.6;
                ">
                  ${safeMessage}
                </div>

              </div>

              <div style="
                text-align: center;
                margin-top: 30px;
              ">

                <a
                  href="${ADMIN_CONTACT_URL}"
                  target="_blank"
                  style="
                    display: inline-block;
                    background: #2F336D;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 13px 25px;
                    border-radius: 6px;
                    font-weight: bold;
                  "
                >
                  View Contact in Admin Panel
                </a>

              </div>

              <p style="
                color: #888888;
                font-size: 12px;
                text-align: center;
                margin-top: 25px;
              ">
                ECO Capacity Exchange Admin Notification
              </p>

            </div>

          </div>

        </body>
      </html>
    `;


    // =================================================
    // SEND BOTH EMAILS
    // =================================================

    const emailResults = await Promise.allSettled([
      sendEmail(
        email,
        'Thank you for contacting ECO Capacity Exchange',
        userEmailHtml,
        {
          replyTo: ADMIN_EMAIL,
        }
      ),

      sendEmail(
        ADMIN_EMAIL,
        `New Contact Enquiry from ${name}`,
        adminEmailHtml,
        {
          replyTo: email,
        }
      ),
    ]);


    // Log email errors but don't lose the contact submission
    emailResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          index === 0
            ? '❌ User confirmation email failed:'
            : '❌ Admin notification email failed:',
          result.reason
        );
      }
    });


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(existingContact ? 200 : 201).json({
      message: existingContact
        ? 'Message added successfully and email notifications processed ✅'
        : 'Contact created successfully and email notifications processed ✅',

      contact: savedContact,
    });

  } catch (error) {
    console.error('❌ Contact Error:', error);

    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


// =====================================================
// GET /api/contact
// =====================================================

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(contacts);

  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


// =====================================================
// DELETE /api/contact/:id
// =====================================================

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      id: req.params.id,
    });

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found ❌',
      });
    }

    return res.status(200).json({
      message: 'Contact deleted successfully ✅',
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};