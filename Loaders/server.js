const express = require("express");
const app = express();
const cors = require('cors');
const geh = require('../api/geh/index')

//Routers
const user = require("../api/User/router");
const book = require("../api/Book/router");
const admin = require("../api/Admins/router");
const genre = require("../api/genre/router");
const author = require("../api/Author/router");
const rate = require("../api/rates/router");
const review = require("../api/reviews/router");
const report = require("../api/reports/router");
const dashboard = require("../api/dashboard/router");
// const Book = require("../api/Book/model");
// const User = require("../api/User/model");

//Midleweare
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.use("/api/v1/admin", admin)
app.use("/api/v1/user", user);
app.use("/api/v1/book", book);
app.use("/api/v1/genre", genre);
app.use("/api/v1/author", author);
app.use("/api/v1/rate", rate);
app.use("/api/v1/review", review);
app.use("/api/v1/report", report);
app.use("/api/v1/dashboard", dashboard);

app.use(geh);

module.exports = app;
