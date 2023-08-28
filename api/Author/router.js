const express = require("express");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");
const uploader = require("../../utils/file_uploader");

const {
  createAuthor,
  getAllAuthors,
  updateAuthorInfo,
  getAuthorById,
  updatAuthorImage,
  deleteAuthor,
  deleteAllAuthors,
} = require("./controller");

router
  .route("/")
  .post(
    protect,
    authByRole("Super-admin", "Admin"),
    createAuthor
  )
  .get(getAllAuthors)
  .delete(protect, authByRole("Super-admin"), deleteAllAuthors);



router
  .route("/:id")
  .get(getAuthorById)
  .patch(
    protect,
    authByRole("Super-admin", "Admin"),
    uploader.single("image"),
    updateAuthorInfo
  )
  .delete(protect, authByRole("Super-admin"), deleteAuthor);

router.patch('/image/:id',protect,
authByRole("Super-admin", "Admin"),updatAuthorImage )
module.exports = router;