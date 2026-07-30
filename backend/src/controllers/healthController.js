const healthService = require("../services/healthService");

async function health(req, res, next) {

    try {

        const healthStatus = await healthService.getHealthStatus();

        res.status(200).json(healthStatus);

    } catch (error) {

        next(error);

    }

}

module.exports = {
    health
};