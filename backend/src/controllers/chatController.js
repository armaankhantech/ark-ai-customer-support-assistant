const ollamaService = require("../services/ollamaService");
const logger = require("../utils/logger");
async function chat(req, res , next) {

    try {

        const { sessionId, message } = req.body;
        logger.info(`New message received from session: ${sessionId}`);

const result = await ollamaService.chat(
    sessionId,
    message
);

res.json(result);

    }

    catch (error) {

    next(error);
    }




}



module.exports = {
    chat
};