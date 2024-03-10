require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const httpStatus = require("http-status");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const routes = require("./routes/v1/index");
const { openapiSpecification } = require('./docs/swaggerDef');

const app = express();

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.options("*", cors());

app.use("/v1", routes);
app.use('/v1/image/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = { app };
