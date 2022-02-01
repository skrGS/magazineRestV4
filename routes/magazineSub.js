const express = require("express");

const {
  getMagazineSubs,
  getMagazineSub,
  createMagazineSub,
  deleteMagazineSub,
} = require("../controller/magazineSubs");

const router = express.Router();

//"/api/v1/books"
router.route("/").get(getMagazineSubs).post(createMagazineSub);

router.route("/:id").get(getMagazineSub).delete(deleteMagazineSub);

module.exports = router;
