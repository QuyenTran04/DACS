const express = require("express");
const Tour = require("../controllers/tour");
const router = express.Router();
const role = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");



router.post("/createTour", role.authenticateToken, role.authorizeRole(["provider","admin"]), upload.array("images"), Tour.createTour);
router.get(
  "/getTour",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.getTour
);

router.put(
  "/updateTour",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.updateTour
);

router.delete(
  "/deleteTour",
  role.authenticateToken,
  role.authorizeRole(["provider", "admin"]),
  Tour.deleteTour
);

router.put(
  "/findTour",
  role.authenticateToken,
  Tour.getToursByLocation
);

module.exports = router;