const express = require("express");
const { createAd, getUserAds, uploadFiletoCloudinary, removeFilefromCloudinary, getAdById, deleteAdsByuserController, deleteAdsByUserIds } = require("../controller/AdController");
const { getUserData } = require("../controller/userController");
// const multer = require('multer');
// const upload = multer({ dest: 'ads/' });

const createUploadMiddleware = require('../middleware/cloudinary');
const { getAdIdsByGrouping } = require("../controller/LocationController");
const upload = createUploadMiddleware('ads');

const router = express.Router();

router.post("/create-ad", createAd);
router.post("/user", getUserData);
router.post('/upload', upload.single('file'), uploadFiletoCloudinary);
router.post('/remove',upload.single('file'), removeFilefromCloudinary);
router.post('/fetchAdIds',getAdIdsByGrouping);
router.get("/getdetails", getUserAds);
router.delete('/delete',deleteAdsByUserIds)
router.get('/:adId', getAdById);


module.exports = router;