const conversationService =
    require("../services/conversationService");


async function deleteConversation(req, res, next) {

    try {

        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }

        const result =
            await conversationService.deleteConversation(sessionId);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
}


async function getConversations(req, res, next) {

    try {

        const conversations =
            await conversationService.getConversations();

        res.json({
            success: true,
            data: conversations
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    deleteConversation,
    getConversations
};