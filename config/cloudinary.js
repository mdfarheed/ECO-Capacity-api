// require('dotenv').config();
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: (req, file) => {
//     let resource_type = 'image';
//     let format = file.mimetype.split('/')[1]; // e.g., jpg, png, mp4, etc.

//     if (file.mimetype.startsWith('video/')) {
//       resource_type = 'video';
//     } else if (file.mimetype === 'image/svg+xml') {
//       resource_type = 'image';
//       format = 'svg';
//     }

//     return {
//       folder: 'website_sections',
//       resource_type,
//       format,
//       chunk_size: 6000000,
//     };
//   },
// });

// module.exports = { cloudinary, storage };


require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let resource_type = 'image';
    let format = file.mimetype.split('/')[1]; // e.g., jpg, png, webp, mp4, etc.

    if (file.mimetype.startsWith('video/')) {
      resource_type = 'video';
    } else if (file.mimetype === 'image/svg+xml') {
      resource_type = 'image';
      format = 'svg';
    } else if (file.mimetype === 'image/webp') {
      resource_type = 'image';
      format = 'webp';
    }

    return {
      folder: 'website_sections',
      resource_type,
      format,
      chunk_size: 6000000,
    };
  },
});

module.exports = { cloudinary, storage };
