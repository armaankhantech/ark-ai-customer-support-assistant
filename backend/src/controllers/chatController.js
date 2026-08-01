const ollamaService = require("../services/ollamaService");
const logger = require("../utils/logger");

async function chat(req, res, next) {

    try {

        const { sessionId, message } = req.body;

        logger.info(
            `New streaming message received from session: ${sessionId}`
        );

        // =====================================
        // Enable HTTP streaming
        // =====================================

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Send headers immediately
        res.flushHeaders();


        // =====================================
        // Stream response from Ollama
        // =====================================

        await ollamaService.streamChat(
            sessionId,
            message,
            (chunk) => {

                if (!res.writableEnded) {
                    res.write(chunk);
                }

            }
        );


        // =====================================
        // Finish stream
        // =====================================

        if (!res.writableEnded) {
            res.end();
        }


        logger.info(
            `Streaming response completed for session: ${sessionId}`
        );

    }

    catch (error) {

        logger.error(
            `Streaming chat error: ${error.message}`
        );

        // If response has already started,
        // we cannot send normal JSON anymore.
        if (res.headersSent) {

            if (!res.writableEnded) {
                res.end();
            }

            return;
        }

        next(error);
    }

}


module.exports = {
    chat
};