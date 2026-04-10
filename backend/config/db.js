// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
// });

// module.exports = pool.promise();

const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.DB_URL) {
    // ✅ Aiven / Production (Render)
    pool = mysql.createPool({
        uri: process.env.DB_URL,
        waitForConnections: true,
        connectionLimit: 10,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    // ✅ Local MySQL (no SSL)
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
    });
}

module.exports = pool;