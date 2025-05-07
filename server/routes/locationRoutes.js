const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location");

router.post("/add", locationController.addLocations);
router.get("/listLocation", locationController.getAllLocations);

module.exports = router;
