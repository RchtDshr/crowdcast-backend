const express = require("express");
const { createAd } = require("../controller/AdController");

const router = express.Router();

router.post("/create-ad", createAd);

module.exports = router;