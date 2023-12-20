const express = require('express');
const router = express.Router();
const checksumController = require('../controllers/checksumController');

router.all('/', (req, res, next) => {
    if (req.method === 'POST') {
        next();
    } else {
        res.json({ message: 'Use a POST request to use the Checksum API.' });
    }
});

router.post('/', checksumController.checksumPost);

module.exports = router;