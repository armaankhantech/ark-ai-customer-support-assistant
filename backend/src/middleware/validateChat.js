const AppError = require("../errors/AppError");

function validateChat(req, res, next) {

    const { sessionId, message } = req.body;

    // Session ID is missing
    if (sessionId === undefined) {
        return next(
            new AppError(
                "Session ID is required.",
                400,
                "SESSION_REQUIRED"
            )
        );
    }

    // Session ID type
    if (typeof sessionId !== "string") {
        return next(
            new AppError(
                "Session ID must be a string.",
                400,
                "INVALID_SESSION_ID"
            )
        );
    }

    req.body.sessionId = sessionId.trim();

    if (req.body.sessionId.length === 0) {
        return next(
            new AppError(
                "Session ID is required.",
                400,
                "SESSION_REQUIRED"
            )
        );
    }

    // Message is missing
    if (message === undefined) {
        return next(
            new AppError(
                "Message is required.",
                400,
                "MESSAGE_REQUIRED"
            )
        );
    }

    // Message type
    if (typeof message !== "string") {
        return next(
            new AppError(
                "Message must be a string.",
                400,
                "INVALID_MESSAGE_TYPE"
            )
        );
    }

    req.body.message = message.trim();

    if (req.body.message.length === 0) {
        return next(
            new AppError(
                "Message cannot be empty.",
                400,
                "EMPTY_MESSAGE"
            )
        );
    }

    next();

}

module.exports = validateChat;