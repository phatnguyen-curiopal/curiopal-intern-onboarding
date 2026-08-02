const express = require("express");

const requestLogger = require("./Middlewares/request-logger");
const app = express();

app.use(requestLogger);

module.exports = app;