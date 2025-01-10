const User = require('../managers/models/user.schema')
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const {createJWT} = require("../managers/token/jwt")


const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userAlreadyExists = await User.findOne({ email });
  if (!userAlreadyExists) {
    const user = await User.create(req.body);
    const token = createJWT(user.id, user.name);
    res.status(StatusCodes.CREATED).json({ user, token: token });
  } else {
    throw new ConflictError("Email already Exists");
  }
});


module.exports = {
  createUser
}