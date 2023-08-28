const express = require("express");
const router = express.Router();

const uploader = require("../../utils/file_uploader");
const userController = require("./controller");
const protect = require("../protect/index");
const authByRole = require("../auth");

router.route("/").post(userController.createUser)
.get(protect, authByRole("Super-admin", "Admin"), userController.getAllUsers)
router.post("/login", userController.login);

router.get(
  "/profile",
  protect,
  authByRole("Client"),
  userController.viewProfile
);

router.get(
  "/readerprofile/:id",
  protect,
  authByRole("Client", "Super-admin", "Admin"),
  userController.viewReaderProfile
);
router.patch(
  "/changestatus/:id",
  protect,
  authByRole("Super-admin", "Admin"),
  userController.changeStatus
);

router.patch(
  "/changeprofile",
  protect,
  uploader.single("image"),
  authByRole("Client"),
  userController.updateAccount
);

router.patch(
  "/addtofavorite",
  protect,
  authByRole("Client"),
  userController.addBookToFavorite
);

router.patch(
  "/removefromfavorite",
  protect,
  authByRole("Client"),
  userController.removeBookFromFavorite
);

router.patch(
  "/followreader",
  protect,
  authByRole("Client"),
  userController.followReader
);

router.patch(
  "/unfollowreader",
  protect,
  authByRole("Client"),
  userController.unFollowReader
);

router.patch(
  "/followauthor",
  protect,
  authByRole("Client"),
  userController.followAuthor
);

router.patch(
  "/unfollowauthor",
  protect,
  authByRole("Client"),
  userController.unFollowAuthor
);

router.get("/weeklyusers", 
protect,
authByRole("Super-admin", "Admin"),
userController.weeklyCreatedUsers)

router.get("/montlyusers", 
protect,
authByRole("Super-admin", "Admin"),
userController.monthlyCreatedUsers)

router.get("/yearlyusers", 
protect,
authByRole("Super-admin", "Admin"),
userController.yearlyCreatedUsers)

module.exports = router;
