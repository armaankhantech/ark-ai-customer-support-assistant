const historyService = require("../services/historyService");

async function getHistory(req, res, next) {

    try {

        const { sessionId } = req.params;

        const history = await historyService.getHistory(sessionId);

        res.json({
            success: true,
            data: history
        });

    } catch (error) {

        next(error);

    }

}

module.exports = {
    getHistory
};