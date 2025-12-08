// src/controllers/linksController.js
const { nanoid } = require("nanoid");
const url = require("url");
const Link = require("../models/Link");

function isValidUrl(str) {
  try {
    const parsed = new url.URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

async function createShortLink(req, res, next) {
  try {
    const { originalUrl, customCode } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "Please provide a valid URL" });
    }

    let code = (customCode || "").trim();

    if (code) {
      // Ensure custom code is not already used
      const existing = await Link.findByCode(code);
      if (existing) {
        return res.status(409).json({ error: "This code is already taken" });
      }
    } else {
      // Generate random short code
      code = nanoid(7);
    }

    const link = await Link.createLink({ code, originalUrl });

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    const shortUrl = `${baseUrl}/${link.code}`;

    return res.status(201).json({
      code: link.code,
      originalUrl: link.original_url,
      shortUrl,
      clicks: link.clicks,
      createdAt: link.created_at
    });
  } catch (err) {
    next(err);
  }
}

async function redirectByCode(req, res, next) {
  try {
    const { code } = req.params;

    const link = await Link.findByCode(code);
    if (!link) {
      return res.status(404).send("Short link not found");
    }

    await Link.incrementClicks(code);
    return res.redirect(link.original_url);
  } catch (err) {
    next(err);
  }
}

async function getLinkStats(req, res, next) {
  try {
    const { code } = req.params;
    const stats = await Link.getStats(code);

    if (!stats) {
      return res.status(404).json({ error: "Short link not found" });
    }

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    stats.shortUrl = `${baseUrl}/${stats.code}`;

    return res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createShortLink,
  redirectByCode,
  getLinkStats
};
