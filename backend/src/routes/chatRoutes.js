const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");
const chatController = require("../controllers/chatController");
const historyController = require("../controllers/historyController");
const validateChat = require("../middleware/validateChat");
const conversationController =
    require("../controllers/conversationController");
router.get("/health", healthController.health);

router.post(
    "/chat",
    validateChat,
    chatController.chat
);

router.get(
    "/conversations",
    conversationController.getConversations
);

router.delete(
    "/conversation/:sessionId",
    conversationController.deleteConversation
);

router.get("/history/:sessionId", historyController.getHistory);

module.exports = router;