const express = require("express");
const {
    signup,
    verifyOtp,
    signin,
} = require('../controller/UserController');


const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/signin", signin);



module.exports = router;