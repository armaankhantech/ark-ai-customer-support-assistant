const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {

    logger.error(err.message);

    res.status(500).json({
        reply: "Something went wrong."
    });

}

module.exports = errorHandler;