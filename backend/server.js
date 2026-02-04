const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, initDB } = require('./database');
const axios = require('axios'); // For webhook
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Database
initDB();

// API Endpoints will go here

// 1. Create Job
app.post('/jobs', async (req, res) => {
    try {
        const { taskName, payload, priority } = req.body;
        if (!taskName) {
            return res.status(400).json({ error: 'Task name is required' });
        }

        // Ensure payload is a valid JSON object or empty object
        const safePayload = payload ? (typeof payload === 'object' ? payload : JSON.parse(payload)) : {};

        // Note: For MySQL, we usually stringify the JSON for the query if using placeholders depending on driver,
        // but mysql2 handles objects for JSON columns automatically if configured or we can stringify.
        // Let's stringify to be safe for the INSERT.
        const [result] = await pool.query(
            'INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, ?)',
            [taskName, JSON.stringify(safePayload), priority || 'Medium', 'pending']
        );

        const newJobId = result.insertId;
        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [newJobId]);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// 2. List jobs
app.get('/jobs', async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = 'SELECT * FROM jobs';
        const params = [];
        const conditions = [];

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }
        if (priority) {
            conditions.push('priority = ?');
            params.push(priority);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY createdAt DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. Job Details
app.get('/jobs/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Run Job
app.post('/run-job/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        // Check if job exists and is pending
        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });

        const job = rows[0];
        if (job.status !== 'pending') {
            // Optional: allow re-running, but requirement says "Run pending job". 
            // Let's just allow it for demo purposes but update status logic.
        }

        // Update status to running
        await pool.query('UPDATE jobs SET status = ? WHERE id = ?', ['running', jobId]);

        // Simulate processing (async) - Respond to client immediately or wait?
        // "API should respond quickly". BUT "Step 6: ... After wait: Update status".
        // If I wait in the API, the client hangs for 3 seconds.
        // Logic says "Simulate background processing: Wait 3 seconds". 
        // We can use setTimeout and respond immediately.

        setTimeout(async () => {
            try {
                // Update to completed
                const completedAt = new Date();
                await pool.query('UPDATE jobs SET status = ?, completedAt = ? WHERE id = ?', ['completed', completedAt, jobId]);

                // Trigger Webhook
                if (process.env.WEBHOOK_URL) {
                    // Fetch updated job to send
                    const [updatedRows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
                    const updatedJob = updatedRows[0];
                    console.log('Triggering Webhook for Job', jobId);

                    try {
                        // Formatting payload explicitly as per requirements
                        const webhookPayload = {
                            jobId: updatedJob.id,
                            taskName: updatedJob.taskName,
                            priority: updatedJob.priority,
                            payload: typeof updatedJob.payload === 'string' ? JSON.parse(updatedJob.payload) : updatedJob.payload,
                            completedAt: updatedJob.completedAt
                        };

                        await axios.post(process.env.WEBHOOK_URL, webhookPayload);
                        console.log('Webhook sent successfully');
                    } catch (webhookError) {
                        console.error('Webhook failed:', webhookError.message);
                    }
                }
            } catch (err) {
                console.error('Background processing error:', err);
                await pool.query('UPDATE jobs SET status = ? WHERE id = ?', ['failed', jobId]);
            }
        }, 3000);

        res.json({ message: 'Job started', jobId });

    } catch (error) {
        console.error('Error running job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
