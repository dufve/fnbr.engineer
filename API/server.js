const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
const security = require('./security'); // Import the security.js file

const xalRoutes = require('./routes/xal');
const checksumRoutes = require('./routes/checksum'); // Import the checksum routes

const app = express();

// Use the security measures as middleware
app.use(security);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the fnbr.engineer API. This service is designed for API interactions, not for direct browser access. Please send requests to a valid endpoint to interact with the API.' });
});

app.use('/xal', xalRoutes);
app.use('/checksum', checksumRoutes); // Use the checksum routes

// Catch-all route handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found, you might be using the wrong method.' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});