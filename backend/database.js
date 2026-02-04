const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Allow multiple statements for initialization
};

const pool = mysql.createPool({
    ...dbConfig,
    database: process.env.DB_NAME || 'job_scheduler',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    try {
        // Create a temporary connection to create the database if it doesn't exist
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'job_scheduler'}\``);
        await tempConnection.end();

        const connection = await pool.getConnection();
        console.log('Database connected successfully (MySQL)');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                taskName VARCHAR(255) NOT NULL,
                payload JSON,
                priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
                status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
                completedAt DATETIME NULL
            )
        `);
        console.log('Jobs table initialized (MySQL)');
        connection.release();
    } catch (error) {
        console.error('Database initialization failed:', error);
        console.error('Ensure MySQL is running and credentials in .env are correct.');
    }
}

module.exports = { pool, initDB };
