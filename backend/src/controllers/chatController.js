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

const reply =
    result.reply ||
    result.ai_response ||
    result.response ||
    result.output;

res.json({
    reply
});

    } catch (error) {

    next(error);

}

}

module.exports = {
    chat
};