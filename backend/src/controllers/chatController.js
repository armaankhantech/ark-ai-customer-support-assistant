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

        res.status(200);

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache, no-store, must-revalidate, no-transform"
        );

        res.setHeader(
            "X-Accel-Buffering",
            "no"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        // Send headers immediately
        res.flushHeaders();

        // =====================================
        // Stream Groq response → browser
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