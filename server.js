const path = require('path');
const dotenv = require('dotenv');

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================
dotenv.config({
  path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seoRoutes = require('./routes/seoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require("./routes/memberRoutes");

connectDB();

const app = express();

app.use(express.json());


// =====================================================
// CORS
// =====================================================
app.use(cors());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// =====================================================
// ROUTES
// =====================================================
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/contactRoutes'));
app.use('/api', require('./routes/blogRoutes'));

app.use('/api/admin', adminRoutes);

app.use("/api/members", memberRoutes);

app.use('/api', require('./routes/articleRoutes'));
app.use('/api', require('./routes/researchRoutes'));
app.use('/api', require('./routes/faqRoutes'));

const subscribeRoutes = require('./routes/subscribeRoutes');
app.use('/api', subscribeRoutes);


// =====================================================
// SEO ROUTES
// =====================================================
app.use('/api/seo', seoRoutes);


// =====================================================
// ROBOTS.TXT & SITEMAP
// =====================================================
app.get('/robots.txt', (req, res) => {
  require('./controllers/seoController').getRobotsTxt(req, res);
});

app.get('/sitemap.xml', (req, res) => {
  require('./controllers/seoController').generateSitemap(req, res);
});


// =====================================================
// DEPLOYMENT TEST API
// =====================================================
app.get('/api/deploy-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ECO Capacity Backend deployed successfully 🚀',
    deployment: 'GitHub Actions + cPanel Passenger',
    version: 'DEPLOY-TEST-009',
    timestamp: new Date().toISOString()
  });
});


// =====================================================
// MULTER
// =====================================================
const multer = require('multer');

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Multer error",
      error: err.message
    });
  }

  if (err) {
    return res.status(500).json({
      message: "Upload failed",
      error: err.message
    });
  }

  next();
});


// =====================================================
// SERVER
// =====================================================
const PORT = process.env.PORT || 8001;

app.listen(PORT, '0.0.0.0', () => {

  console.log(`✅ Server running on port ${PORT}`);

  // Safe debug information
  console.log('==============================================');
  console.log('📧 EMAIL CONFIGURATION');
  console.log('==============================================');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
  console.log('==============================================');
});