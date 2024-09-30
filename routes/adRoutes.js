const express = require("express");
const { createAd, getUserAds } = require("../controller/AdController");
const { getUserData } = require("../controller/UserController");

const router = express.Router();

router.post("/create-ad", createAd);
router.post("/user", getUserData);
router.get("/getdetails", getUserAds)
module.exports = router;