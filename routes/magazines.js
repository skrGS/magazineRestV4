const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getMagazine,
  getMagazines,
  createMagazine,
  deleteMagazine,
  updateMagazine,
  uploadMagazinePhoto,
} = require("../controller/magazines");

const router = express.Router();

//"/api/v1/magazines"
router
  .route("/")
  .get(getMagazines)
  .post(protect, authorize("admin", "operator"), createMagazine);

router
  .route("/:id")
  .get(getMagazine)
  .delete(protect, authorize("admin", "operator"), deleteMagazine)
  .put(protect, authorize("admin", "operator"), updateMagazine);

router.route("/:id/upload-photo").put(uploadMagazinePhoto);

module.exports = router;
