const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");

const {
  addReview,
  viewMyReviewsOfBooks,
  findReview
} = require("./controller");

router
  .route("/")
  .post(protect, authByRole("Client"), addReview)

router.route("/:id").get(protect, authByRole("Client"), viewMyReviewsOfBooks)

router.get("/find/:id", protect, authByRole("Super-admin"), findReview)
module.exports = router;
