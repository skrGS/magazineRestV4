const express = require("express");

const {
  getPlusSubs,
  getPlusSub,
  createPlusSub,
  deletePlusSub,
} = require("../controller/plusSubs");

const router = express.Router();

//"/api/v1/books"
router.route("/").get(getPlusSubs).post(createPlusSub);

router.route("/:id").get(getPlusSub).delete(deletePlusSub);

module.exports = router;
