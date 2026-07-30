const crypto = require("crypto");
const logger = require("../utils/logger");

function requestLogger(req, res, next) {

    const start = Date.now();

    const requestId = crypto.randomUUID();

    req.requestId = requestId;

    res.on("finish", () => {

        logger.info("Request completed", {

            requestId,

            method: req.method,

            endpoint: req.originalUrl,

            status: res.statusCode,

            sessionId: req.body?.sessionId || null,

            duration: `${Date.now() - start} ms`

        });

    });

    next();

}

module.exports = requestLogger;