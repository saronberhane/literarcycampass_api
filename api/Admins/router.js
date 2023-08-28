const express = require("express");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");

const {
  createSuperAdmin,
  deleteAdmin,
  createAdmin,
  changeAdminStatus,
  changeUserStatus,
  login,
  changeAdminRole,
  viewAdmin,
  getAllAdmins
} = require("./controller");

router
  .route("/")
  .get(protect, authByRole("Super-admin", "Admin"), getAllAdmins)
  .post(createSuperAdmin)
  .delete(protect, authByRole("Super-admin"), deleteAdmin);

router.post("/login", login);
router.post("/createadmin", protect, authByRole("Super-admin"), createAdmin);
router.patch("/role", protect, authByRole("Super-admin"), changeAdminRole);

router.get('/:id', protect, authByRole("Super-admin"), viewAdmin)
router.patch(
  "/changestatus/:id",
  protect,
  authByRole("Super-admin"),
  changeAdminStatus
);
router.patch(
  "/changeuserstatus/:id",
  protect,
  authByRole("Super-admin", "Admin"),
  changeUserStatus
);

module.exports = router;