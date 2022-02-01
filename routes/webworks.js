const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getWebWork,
  getWebWorks,
  createWebWork,
  deleteWebWork,
  updateWebWork,
  uploadWebWorkPhoto,
} = require("../controller/webworks");

const router = express.Router();

//"/api/v1/WebWorks"
router
  .route("/")
  .get(getWebWorks)
  .post(protect, authorize("admin", "operator"), createWebWork);

router
  .route("/:id")
  .get(getWebWork)
  .delete(protect, authorize("admin", "operator"), deleteWebWork)
  .put(protect, authorize("admin", "operator"), updateWebWork);

router.route("/:id/upload-photo").put(uploadWebWorkPhoto);

module.exports = router;
