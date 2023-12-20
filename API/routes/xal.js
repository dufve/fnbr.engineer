const express = require('express');
const router = express.Router();
const xalController = require('../controllers/xalController');

router.all('/', (req, res, next) => {
    if (req.method === 'POST') {
        next();
    } else {
        res.json({ message: 'Use a POST request to use the XAL API.' });
    }
});

router.post('/', xalController.xalPost);

module.exports = router;