const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('💡 Check your DATABASE_URL in .env file');
    } else {
        console.log('✓ Database connected successfully');
    }
});

module.exports = pool;