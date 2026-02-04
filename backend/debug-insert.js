const { pool } = require('./database');

async function debugInsert() {
    try {
        console.log('1. Testing Database Connection...');
        const connection = await pool.getConnection();
        console.log('   Success! Connection ID:', connection.threadId);
        connection.release();

        console.log('2. checking if table "jobs" exists...');
        const [tables] = await pool.query("SHOW TABLES LIKE 'jobs'");
        if (tables.length === 0) {
            console.error('   ERROR: Table "jobs" does not exist!');
            process.exit(1);
        }
        console.log('   Success! Table found.');

        console.log('3. Trying to insert a test job...');
        const taskName = "Debug Job";
        const payload = JSON.stringify({ test: "data" });
        const priority = "Low";
        const status = "pending";

        const [result] = await pool.query(
            'INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, ?)',
            [taskName, payload, priority, status]
        );
        console.log('   Success! Job inserted. Insert ID:', result.insertId);

        console.log('4. cleaning up test job...');
        await pool.query('DELETE FROM jobs WHERE id = ?', [result.insertId]);
        console.log('   Success! Cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('\n!!! DEBUG FAILED !!!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

debugInsert();
