const { pool } = require('./database');

async function check() {
    try {
        console.log('Connecting to MySQL...');
        const [rows] = await pool.query('SELECT * FROM jobs');
        console.log('\n--- Current Data in MySQL Database (Table: jobs) ---');
        if (rows.length === 0) {
            console.log('No jobs found. (Table is empty)');
        } else {
            // Print table using console.table for nice formatting
            console.table(rows.map(job => ({
                id: job.id,
                taskName: job.taskName,
                status: job.status,
                priority: job.priority,
                created: job.createdAt
            })));
        }
        console.log('----------------------------------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
}

check();
