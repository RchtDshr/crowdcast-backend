const express = require("express");
const { createAd } = require("../controller/AdController");
const { getUserData } = require("../controller/UserController");

const router = express.Router();

router.post("/create-ad", createAd);
router.post("/user", getUserData);

module.exports = router;