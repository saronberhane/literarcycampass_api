const express = require("express");
const router = express.Router();
const protect = require("../protect/index");
const authByRole = require("../auth");

const {
    rateBook,
    removeRateBook,
    viewRatedBooks,
    removeAllRates
} = require("./controller");


router.route("/").get(protect, authByRole("Client"), viewRatedBooks)
    .delete(protect, authByRole("Super-admin"), removeAllRates)

router.route("/:id").post(protect, authByRole("Client"), rateBook)
    .delete(protect, authByRole("Client"), removeRateBook)


module.exports = router;