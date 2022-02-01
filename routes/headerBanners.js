const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getHeaderBanners,
  getHeaderBanner,
  createHeaderBanner,
  deleteHeaderBanner,
  updateHeaderBanner,
  uploadHeaderBannerPhoto,
} = require("../controller/headerBanner");

const router = express.Router();

//"/api/v1/books"
router
  .route("/")
  .get(getHeaderBanners)
  .post(protect, authorize("admin", "operator"), createHeaderBanner);

router
  .route("/:id")
  .get(getHeaderBanner)
  .delete(protect, authorize("admin", "operator"), deleteHeaderBanner)
  .put(protect, authorize("admin", "operator"), updateHeaderBanner);

router.route("/:id/upload-photo").put(uploadHeaderBannerPhoto);

module.exports = router;
