class CustomError extends Error {
  constructor(message, statusCode, statusText = "fail") {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}
module.exports = CustomError;