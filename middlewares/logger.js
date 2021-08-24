const express = require("express");
const { createStream } = require("rotating-file-stream");
const path = require("path");

const morgan = require("morgan");

const app = express();
var logDirectory = path.join(__dirname, "../../logs");

/** access log */
const accessLogStream = createStream("access.log", {
  size: "30K",
  interval: "1d",
  path: logDirectory,
  compress: "gzip",
});
app.use(
  morgan(
    ":remote-addr :method :url :status [:date[clf]] :res[content-length] - :response-time ms",
    { stream: accessLogStream }
  )
);

/** error log */
const errorLogStream = createStream("error.log", {
  size: "30K",
  interval: "1d",
  path: logDirectory,
  compress: "gzip",
});
app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);

module.exports = app;
