const express = require("express");
const {
    signup,
    verifyOtp,
    signin,
    getUserData,
    addCredits
} = require('../controller/userController');
const { getTimelineEntriesByUserId } = require("../controller/TimelineController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/signin", signin);
router.get('/getUser', getUserData);
router.post('/addCredits', authenticate, addCredits);
router.get('/getUserTimeline', authenticate, getTimelineEntriesByUserId);

module.exports = router;