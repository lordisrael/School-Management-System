const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, Please try again",
    stack: err.stack,
  };
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.code && err.code == 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, Please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name == "CastError") {
    customError.msg = `No item found with this id: ${err.value}`;
    customError.statusCode = 404;
  }
  // if(err.name = 'ValidationError'){
  //     customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
  //     customError.statusCode = 400
  // }

  return res.status(customError.statusCode).json({
    msg: customError.msg,
    stack: customError.stack,
  });
};

module.exports = errorHandlerMiddleware;
