const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");

const {
  createGenre,
  getGenreById,
  updateGenre,
  deleteAllGenres,
  deleteGenre,
  getAllGenres,
} = require("./controller");

router
  .route("/")
  .get(getAllGenres)
  .post(protect, authByRole("Super-admin"), createGenre)
  .delete(protect, authByRole("Super-admin"), deleteAllGenres);

// router.route("/by").get(protect, getByGenreOrPrice).delete(deleteBook);

router
  .route("/:id")
  .get(protect, authByRole("Super-admin", "Admin"), getGenreById)
  .patch(protect, authByRole("Super-admin", "Admin"), updateGenre)
  .delete(protect, authByRole("Super-admin", "Client"), deleteGenre);

module.exports = router;
