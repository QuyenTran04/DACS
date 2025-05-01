const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location");

router.get("/", locationController.getAllLocations);

module.exports = router;
