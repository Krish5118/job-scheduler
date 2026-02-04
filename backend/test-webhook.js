const axios = require('axios');
require('dotenv').config();

async function testWebhook() {
    console.log('--- Webhook Test Script ---');

    const url = process.env.WEBHOOK_URL;
    if (!url) {
        console.error('ERROR: WEBHOOK_URL is missing in .env');
        process.exit(1);
    }

    console.log(`Target URL: ${url}`);
    console.log('Sending test payload...');

    try {
        const payload = {
            message: "Hello! This is a test from the Job Scheduler.",
            timestamp: new Date().toISOString()
        };

        const response = await axios.post(url, payload);

        console.log('\n✅ Success! Status Code:', response.status);
        console.log('👉 Go to your Webhook.site tab NOW.');
        console.log('👉 You should see a NEW request on the left sidebar.');
    } catch (error) {
        console.error('\n❌ Failed to send webhook.');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
        }
    }
}

testWebhook();
