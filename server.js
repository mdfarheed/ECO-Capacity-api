const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seoRoutes = require('./routes/seoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require("./routes/memberRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.use(cors()); 

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/contactRoutes'));
app.use('/api', require('./routes/blogRoutes'));
app.use('/api', require('./routes/eventRoutes'));
app.use('/api', require('./routes/heroRoutes'));
app.use('/api', require('./routes/heroRoutes'));
app.use('/api', require('./routes/videoSectionRoutes'));
app.use('/api', require('./routes/sectionOneRoutes'));
app.use('/api', require('./routes/thirdSectionRoutes'));
app.use('/api', require('./routes/sectionFourRoutes'));
app.use('/api', require('./routes/sectionFifthRoutes'));
app.use('/api', require('./routes/sectionEightRoute'));
app.use('/api', require('./routes/sectionSixRoutes'));
app.use('/api', require('./routes/sectionSevenRoutes'));
app.use('/api', require('./routes/sectionNineRoutes'));
app.use('/api/admin', adminRoutes);
app.use("/api/members", memberRoutes);
const subscribeRoutes = require('./routes/subscribeRoutes');
app.use('/api', subscribeRoutes);


// SEO Routes
app.use('/api/seo', seoRoutes);


// robots.txt & sitemap direct access
app.get('/robots.txt', (req, res) => {
  require('./controllers/seoController').getRobotsTxt(req, res);
});
app.get('/sitemap.xml', (req, res) => {
  require('./controllers/seoController').generateSitemap(req, res);
});





const multer = require('multer');

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "Multer error", error: err.message });
  } else if (err) {
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
  next();
});


const PORT = process.env.PORT || 5000;

// 👇 Change yahan kiya gaya hai
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});