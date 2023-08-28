const jwt = require("jsonwebtoken");
const config = require("../configs");

module.exports.createJWT = (id, role) => {
  return jwt.sign({ id, role }, config.jwt, { expiresIn: config.expiresIn });
};
