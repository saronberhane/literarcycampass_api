const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");

const {
    addReport,
    getReporteds,
    deleteRport,
    removeReview,
    getReport
} = require("./controller");

router
  .route("/")
  .get(protect, authByRole("Super-admin", "Admin"), getReporteds)
  .post(protect, authByRole("Client"), addReport)
  .delete(protect, authByRole("Admin", "Super-admin"), deleteRport)

router.delete("/removereview", protect, authByRole("Admin", "Super-admin"),removeReview)

router.route("/:id")
.get(protect, authByRole("Super-admin", "Admin"), getReport)
module.exports = router;