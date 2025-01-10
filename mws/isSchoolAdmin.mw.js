const User = require("../managers/models/user.schema");
const { UnauthenticatedError } = require("../errors");
const asyncHandler = require("express-async-handler");
const isSuperAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const schoolAdminEmail = await User.findOne({ email });
  if (schoolAdminEmail.role != "school_admin") {
    throw new UnauthenticatedError("You are not the School Admin");
  } else {
    next();
  }
});

module.exports = isSchoolAdmin;
