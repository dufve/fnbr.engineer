const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;
const security = require('./security');

const xalRoutes = require('./routes/xal');
const checksumRoutes = require('./routes/checksum');

const app = express();

app.use(security);

// Serve static files from the Website directory
app.use(express.static(path.join(__dirname, '../Website')));

// Dynamic route handler for static files
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../Website/${req.params.page}/${req.params.page}.html`));
});

// Set up API routes under /api/
app.use('/api/xal', xalRoutes);
app.use('/api/checksum', checksumRoutes);

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found, you might be using the wrong method.' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});