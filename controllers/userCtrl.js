const User = require('../managers/models/user.schema')
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require("http-status-codes");
const {createJWT, createRefreshJWT} = require("../managers/token/jwt")
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthenticatedError}= require("../errors")

const createUser = asyncHandler(async (req, res) => {
  const { email, role, school } = req.body;
  const userAlreadyExists = await User.findOne({ email });

  // Check for school when role is superadmin
  if (role === "school_admin" && !school) {
    throw new BadRequestError("School is required for school admin.");
  }
  if (!userAlreadyExists) {
    const user = await User.create(req.body);
    const token = createJWT(user.id, user.name || "defaultName");
    res.status(StatusCodes.CREATED).json({ user, token: token });
  } else {
    throw new ConflictError("Email already Exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    const refreshToken = await createRefreshJWT(user._id);
    await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      status: "Success",
      data: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
      },
      token: createJWT(user._id, user.name),
    });
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }
});


module.exports = {
  createUser,
  loginUser
}