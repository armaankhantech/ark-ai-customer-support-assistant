const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");
const chatController = require("../controllers/chatController");

const validateChat = require("../middleware/validateChat");

router.get("/health", healthController.health);

router.post(
    "/chat",
    validateChat,
    chatController.chat
);

module.exports = router;