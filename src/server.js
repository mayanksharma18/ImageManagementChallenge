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
const {openapiSpecification} = require('./docs/swaggerDef')
const app = express();

// Database Connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent XSS and NoSQL injections
app.use(xss());
app.use(mongoSanitize());

// Enable CORS for all origins
app.use(cors());
app.options("*", cors());



// API routes
app.use("/v1", routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Custom error handling for unknown routes
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
});

// Error handling middleware for formatting errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
