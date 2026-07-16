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
        logger.info("AI response received successfully.");

        res.json({
            reply: result.ai_response
        });

    } catch (error) {

    next(error);

}

}

module.exports = {
    chat
};