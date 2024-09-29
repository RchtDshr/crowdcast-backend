const express = require("express");
const {
    signup,
    verifyOtp,
    signin,
    getUserData
} = require('../controller/UserController');

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/signin", signin);
router.get('/getUser', getUserData);

module.exports = router;