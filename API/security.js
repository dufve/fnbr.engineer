const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss');

const security = express();

// Helmet for setting various HTTP headers for security
security.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));

// Configure HTTP Strict Transport Security (HSTS)
security.use(helmet.hsts({
    maxAge: 63072000, // Set to 2 years in seconds
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true
}));

// CORS configuration
const corsOptions = {
    origin: 'https://fnbr.engineer', // Replace with your domain
    optionsSuccessStatus: 200
};

security.use(cors(corsOptions));

// Rate Limiter configuration
const limiter = rateLimit({
    windowMs: 60 * 1000, // 60 seconds
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many requests, please try again after a minute."
});

// Apply the rate limiter to all requests
security.use(limiter);

// Body Parser with Size Limit
security.use(bodyParser.json({
    limit: '50kb' // Limit the payload size
}));

// Middleware to check if request body is undefined
security.use((req, res, next) => {
    if (req.body === undefined) {
        res.status(400).json({ error: 'Request body is required' });
    } else {
        next();
    }
});

// Content-Type Validation Middleware
security.use((req, res, next) => {
    if (req.method === 'POST') {
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
            res.status(415).send('Content-Type not supported. Please use application/json.');
        } else {
            next();
        }
    } else {
        next();
    }
});

// Custom Error Handler for 'Payload Too Large' Error
security.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: "Payload too large" });
    } else {
        next(err); // Pass on to the next error handler
    }
});

// Custom Error Handler for 'Unexpected end of JSON input' Error
security.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err); // Pass on to the next error handler
});

// General Error Handling Middleware
security.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!');
});

module.exports = security;