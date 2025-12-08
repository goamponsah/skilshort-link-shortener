// src/models/Link.js
const db = require("../db");

async function createLink({ code, originalUrl }) {
  const query = `
    INSERT INTO links (code, original_url)
    VALUES ($1, $2)
    RETURNING id, code, original_url, clicks, created_at
  `;
  const values = [code, originalUrl];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function findByCode(code) {
  const { rows } = await db.query(
    "SELECT * FROM links WHERE code = $1 LIMIT 1",
    [code]
  );
  return rows[0] || null;
}

async function incrementClicks(code) {
  await db.query(
    "UPDATE links SET clicks = clicks + 1 WHERE code = $1",
    [code]
  );
}

async function getStats(code) {
  const { rows } = await db.query(
    "SELECT code, original_url, clicks, created_at FROM links WHERE code = $1",
    [code]
  );
  return rows[0] || null;
}

module.exports = {
  createLink,
  findByCode,
  incrementClicks,
  getStats
};
