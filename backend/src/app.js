const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const rateLimiter = require("./middleware/rateLimiter");
const app = express();
const helmet = require("helmet");
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL
    
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(requestLogger);
app.use(rateLimiter);
app.use("/", chatRoutes);
app.use(errorHandler);

module.exports = app;