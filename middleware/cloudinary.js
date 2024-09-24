const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      // allowed_formats is omitted to allow any type
      public_id: (req, file) => {
        const fileName = path.parse(file.originalname).name;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `${file.fieldname}-${fileName}-${uniqueSuffix}`;
      },
    },
  });
};

const createUploadMiddleware = (folder) => {
  const storage = createCloudinaryStorage(folder);
  return multer({ storage: storage });
};

module.exports = createUploadMiddleware;