const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  // Allow overriding via env var; default to 10s to avoid premature timeouts on slow networks
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT_MS, 10) || 10000,
  // Optional SSL: set DB_SSL=true in environments that require SSL (e.g., managed DBs)
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Handle connection errors
pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

// Test connection on startup
// Quick startup check (non-throwing) to give clearer diagnostics
if (!process.env.DATABASE_URL) {
  console.error("❌ No DATABASE_URL found. Set DATABASE_URL in your environment.");
} else {
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
      console.error("💡 Check your DATABASE_URL and DB_SSL settings");
    } else {
      console.log("✓ Database connected successfully");
    }
  });
}

module.exports = pool;
