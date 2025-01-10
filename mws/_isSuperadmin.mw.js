const User = require("../managers/models/user.schema");
const { UnauthenticatedError } = require("../errors");
const asyncHandler = require("express-async-handler");
const isSuperAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const superAdminEmail = await User.findOne({ email });
  if (superAdminEmail.role != "superadmin") {
    throw new UnauthenticatedError("You are not an Admin");
  } else {
    next();
  }
});

module.exports = isSuperAdmin;
