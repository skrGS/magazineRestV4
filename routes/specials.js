const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getSpecial,
  getSpecials,
  createSpecial,
  deleteSpecial,
  updateSpecial,
  uploadSpecialPhoto,
} = require("../controller/specials");

const router = express.Router();

//"/api/v1/Special"
router
  .route("/")
  .get(getSpecials)
  .post(protect, authorize("admin", "operator"), createSpecial);

router
  .route("/:id")
  .get(getSpecial)
  .delete(protect, authorize("admin", "operator"), deleteSpecial)
  .put(protect, authorize("admin", "operator"), updateSpecial);

router.route("/:id/upload-photo").put(uploadSpecialPhoto);

module.exports = router;
