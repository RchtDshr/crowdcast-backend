const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to create Cloudinary storage
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      resource_type: 'auto', // Automatically detect the file type (e.g., video, image)
      format: async (req, file) => {
        // Extract the extension for better format handling
        return path.extname(file.originalname).slice(1); // e.g., 'mp4', 'jpg'
      },
      public_id: (req, file) => {
        const fileName = path.parse(file.originalname).name;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return `${file.fieldname}-${fileName}-${uniqueSuffix}`;
      },
    },
  });
};

// Create multer upload middleware
const createUploadMiddleware = (folder) => {
  const storage = createCloudinaryStorage(folder);
  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Optional file validation
      const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv|mov/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      if (extname) {
        return cb(null, true);
      } else {
        return cb(new Error('Unsupported file type!'));
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  });
};

module.exports = createUploadMiddleware;
