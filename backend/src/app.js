const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const rateLimiter = require("./middleware/rateLimiter");
const app = express();
const helmet = require("helmet");
app.use(helmet());
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (curl, Postman, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(requestLogger);
app.use(rateLimiter);
app.use("/", chatRoutes);
app.use(errorHandler);

module.exports = app;