const express = require("express");
const {
  model
} = require("mongoose");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");
const uploader = require("../../utils/file_uploader");

const {
  createBook,
  rateBook,
  mostratedBoks,
  getAllBooks,
  getBook,
  updateBook,
  searchBook,
  filterBooksByGenre,
  viewRatedBooks,
  deleteBook,
  newBooks,
  removeRateBook,
  getByAuthorId,
  deleteAllBooks,
  getBookReviews
} = require("./controller");

router
  .route("/")
  .get(getAllBooks)
  .post(
    protect,
    authByRole("Super-admin", "Admin"),
    uploader.single("image"),
    createBook
  )
  .delete(protect, authByRole("Super-admin", "Admin"), deleteAllBooks);

router.get('/viewmyrates', protect, authByRole("Client"), viewRatedBooks)
router.get("/new", newBooks);
router.get("/mostrated", mostratedBoks)
router.get("/search", searchBook);

router
  .route("/:id")
  .get(getBook)
  .patch(
    protect,
    authByRole("Super-admin", "Admin"),
    uploader.single("image"),
    updateBook
  )
  .delete(protect, authByRole("Super-admin", "Admin"), deleteBook);

router.post("/rate/:id", protect, authByRole("Client"), rateBook)
router.delete("/removerate/:id", protect, authByRole("Client"), removeRateBook)


router.get("/reviews/:id", getBookReviews)
router.get("/filterbygenre/:genre", filterBooksByGenre);
router.get("/byauthorid/:id", getByAuthorId)

module.exports = router;