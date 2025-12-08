// src/db.js
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
  console.error("Unexpected PG client error", err);
  process.exit(-1);
});

module.exports = pool;
