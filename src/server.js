// src/server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const linksRouter = require("./routes/links");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// Routes
app.use("/", linksRouter);

// Health check route (useful for Railway)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler (after routes)
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Link shortener listening on port ${PORT}`);
});
