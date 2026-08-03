const express = require("express");
const requestLogger = require("./Middlewares/request-logger");
const taskRouter = require("./Routes/task.routes");
const errorHandler = require("./Middlewares/error-handler");

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use("/tasks", taskRouter);

app.use(errorHandler);

module.exports = app;