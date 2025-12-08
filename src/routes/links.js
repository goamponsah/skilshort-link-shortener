// src/routes/links.js
const express = require("express");
const router = express.Router();
const {
  createShortLink,
  redirectByCode,
  getLinkStats
} = require("../controllers/linksController");

// API to create a new short link
router.post("/api/shorten", createShortLink);

// API to see stats of a short link
router.get("/api/stats/:code", getLinkStats);

// Redirect route (must be last so it doesn't catch /api paths)
router.get("/:code", redirectByCode);

module.exports = router;
