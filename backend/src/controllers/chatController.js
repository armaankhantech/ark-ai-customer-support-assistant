const ollamaService = require("../services/ollamaService");
const logger = require("../utils/logger");

async function chat(req, res, next) {
    try {

        const { sessionId, message } = req.body;

        logger.info(
            `New streaming message received from session: ${sessionId}`
        );

        // =====================================
        // SSE headers
        // =====================================

        res.status(200);

        res.setHeader(
            "Content-Type",
            "text/event-stream; charset=utf-8"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache, no-transform"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        res.setHeader(
            "X-Accel-Buffering",
            "no"
        );

        res.flushHeaders();


        // =====================================
        // Stream response
        // =====================================

        await ollamaService.streamChat(
            sessionId,
            message,
            (chunk) => {

                if (res.writableEnded) {
                    return;
                }

                // SSE format
                res.write(
                    `data: ${JSON.stringify(chunk)}\n\n`
                );

            }
        );


        // =====================================
        // End SSE stream
        // =====================================

        if (!res.writableEnded) {

            res.write(
                "data: [DONE]\n\n"
            );

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