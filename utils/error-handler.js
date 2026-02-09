const errorHandler = function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "Failed",
      message: "User is not authorized",
    });
  } else if (err.name === "ValidationError") {
    return res.status(401).json({
      status: "Failed",
      message: "User is not validated",
    });
  }

  res.status(err.status).json({
    status: "Failed",
    message: err,
  });
};

module.exports = errorHandler;
