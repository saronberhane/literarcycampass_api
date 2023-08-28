class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
  }
}

// Export AppError
module.exports = AppError;
