const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {

    // Log the error
    logger.error(err.message, {

    requestId: req.requestId,

    endpoint: req.originalUrl,

    status: err.statusCode || 500,

    code: err.code || "INTERNAL_SERVER_ERROR"

});

    // If it's not an AppError, treat it as an internal server error
    const statusCode = err.statusCode || 500;

    const message =
        err.message || "Unable to process your request.";

    const code =
        err.code || "INTERNAL_SERVER_ERROR";

    res.status(statusCode).json({
        success: false,
        message,
        code
    });

}

module.exports = errorHandler;