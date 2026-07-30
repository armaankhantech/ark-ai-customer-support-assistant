const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const rateLimiter = rateLimit({

    windowMs: env.RATE_LIMIT_WINDOW_MS,

    max: env.RATE_LIMIT_MAX_REQUESTS,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED"
    }

});

module.exports = rateLimiter;