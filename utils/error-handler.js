
const HTTPStatusText = require("./HTTPStatusText");

const errorHandler = function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: HTTPStatusText.FAIL,
      message: "User is not authorized",
    });
  } else if (err.name === "ValidationError") {
    return res.status(401).json({
      status: HTTPStatusText.FAIL,
      message: "User is not validated",
    });
  }

  res.status(err.status).json({
    status: HTTPStatusText.FAIL,
    message: err,
  });
};

module.exports = errorHandler;
