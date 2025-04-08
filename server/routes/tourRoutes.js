const express = require("express");
const Tour = require("../controllers/tour");
const router = express.Router();
const role = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");



router.post("/", role.authenticateToken, role.authorizeRole(["provider","admin"]), upload.array("images"), Tour.createTour);

module.exports = router;