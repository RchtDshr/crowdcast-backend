const express = require("express");
const { createAd, getUserAds, uploadFiletoCloudinary, removeFilefromCloudinary } = require("../controller/AdController");
const { getUserData } = require("../controller/UserController");
// const multer = require('multer');
// const upload = multer({ dest: 'ads/' });

const createUploadMiddleware = require('../middleware/cloudinary');
const upload = createUploadMiddleware('ads');

const router = express.Router();

router.post("/create-ad", createAd);
router.post("/user", getUserData);
router.post('/upload', upload.single('file'), uploadFiletoCloudinary);
router.post('/remove',upload.single('file'), removeFilefromCloudinary)

router.get("/getdetails", getUserAds)

module.exports = router;