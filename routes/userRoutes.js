const express = require("express");
const {
    signup,
    verifyOtp
} = require('../controller/UserController');

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);

module.exports = router;