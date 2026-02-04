const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001; // Running on a different port than the main app

app.use(cors());
app.use(bodyParser.json());

console.log('--- Local Webhook Receiver ---');
console.log(`Waiting for webhooks at: http://localhost:${PORT}/webhook`);
console.log('--------------------------------------------------');

app.post('/webhook', (req, res) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 🔔 WEBHOOK RECEIVED!`);
    console.log('--------------------------------------------------');
    console.dir(req.body, { depth: null, colors: true });
    console.log('--------------------------------------------------');
    res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
    // Keep the process alive
});
