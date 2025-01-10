const jwt = require("jsonwebtoken");
const dotenv = require("../../config/app.config")
const createJWT = function (id) {
  return jwt.sign({ id }, dotenv.JWT_SECRET, {
    expiresIn: dotenv.JWT_LIFETIME,
  });
};

const createRefreshJWT = function (id) {
  return jwt.sign({ id }, dotenv.JWT_SECRET, {
    expiresIn: dotenv.RJWT_LIFETIME,
  });
};

module.exports = {
  createJWT,
  createRefreshJWT,
};
