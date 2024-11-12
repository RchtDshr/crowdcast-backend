const express = require("express");
const { getAdIdsByGrouping } = require("../controller/LocationController");
const { getAdById } = require("../controller/AdController");
const { reduceCredits } = require("../controller/UserController");
const { addTimelineEntry } = require("../controller/TimelineController");
const router = express.Router();


router.post('/fetchAdIds',getAdIdsByGrouping);
router.get('/:adId', getAdById);
router.post('/reduceCredits', reduceCredits);
router.post('/addToTimeline', addTimelineEntry);

module.exports = router;