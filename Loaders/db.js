const mongoose = require("mongoose");
const configs = require("../configs");

module.exports = () => {
  mongoose
    .connect(configs.db.remote)
    .then((con) => {
      console.log("Connected Successfully");
    })
    .catch((error) => {
      console.error(error);
    });

  //to check if the datebase is working
  const db_connection = mongoose.connection;

  db_connection.on("error", (error) => {
    console.log("There is an error");
    console.error(error);
  });

  db_connection.on("disconnected", () => {
    console.log("The database is disconnected");
  });
};
