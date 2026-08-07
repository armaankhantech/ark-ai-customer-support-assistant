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

// =====================================
// Enable HTTP streaming
// =====================================

res.status(200);

res.setHeader("Content-Type", "text/plain; charset=utf-8");
res.setHeader("Cache-Control", "no-cache, no-transform");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");

// Tell proxies not to buffer the response
res.flushHeaders();

        // =====================================
        // Stream Groq response → browser
        // =====================================
        res.write("");
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