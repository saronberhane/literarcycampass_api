const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");
const {totalAmount, usersStat, listEveryUsers} = require('./controller');

router.get('/amounts', protect, authByRole("Super-admin", "Admin"), totalAmount);
router.get('/userstat', protect, authByRole("Super-admin", "Admin"), usersStat);
router.get('/allusers', protect, authByRole("Super-admin", "Admin"), listEveryUsers);


module.exports = router;