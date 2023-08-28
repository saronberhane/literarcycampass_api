// Global Error Handler

// Config
const configs = require("../../configs");

// App Error
const AppError = require("../../utils/appError");

// Send Dev Error
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

// Send Prod Error
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Opps!! Unknown Error. Please try again",
    });
  }
};

// Global Error Handler
const geh = (err, req, res, next) => {
  err.status = err.status || "ERROR";
  err.statusCode = err.statusCode || 500;

  // Duplicate data error
  if (err.code === 11000) {
    if (err.message.includes("phoneNumber")) {
      err = new AppError("Phone number is already used.", 400);
    } else if (err.message.includes("email")) {
      err = new AppError("Email is already used", 400);
    } else if (err.message.includes("name")) {
      err = new AppError("Duplicate name found", 400);
    }
  }

  // File too large
  if (err.message === "File too large") {
    if (err.field === "serviceProviderEducation") {
      err = new AppError("Education files size is too large", 400);
    } else if (err.field === "serviceProviderCertificate[]") {
      err = new AppError("Certificates file size is too large", 400);
    } else if (err.field === "serviceProviderId") {
      err = new AppError("ID file size is too large", 400);
      console.log("ID file size is too large");
    } else if (err.field === "img") {
      err = new AppError("Image size is too large", 400);
    } else {
      err = new AppError("File size is too large", 400);
    }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(" || ");
    err = new AppError(message, 400);
  }

  // Casting error
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new AppError(message, 404);
  }

  // JWT token error
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Please login", 401);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    err = new AppError("Please login", 401);
  }

  // Send different error for different environments
  if (configs.env === "development") {
    sendDevError(err, res);
  } else if (configs.env === "production" || configs.env === "qa") {
    sendProdError(err, res);
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Unknown environment selected",
    });
  }
};

// Export GEH
module.exports = geh;
