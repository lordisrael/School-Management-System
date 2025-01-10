const User = require("../managers/models/user.schema");
const jwt = require("jsonwebtoken");
const dotenv = require('../config/app.config')
const { UnauthenticatedError } = require("../errors");
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError(
      "Authentication Invalid, No token attached to this header"
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const payLoad = jwt.verify(token, dotenv.JWT_SECRET);
    const user = await User.findById(payLoad.id);
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentiation Invalid");
  }
});

module.exports = auth;
