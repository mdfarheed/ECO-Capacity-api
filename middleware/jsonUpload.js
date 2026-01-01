const multer = require("multer");

const storage = multer.memoryStorage();

const jsonUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Only JSON files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = jsonUpload;
