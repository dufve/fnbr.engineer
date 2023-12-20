const xss = require('xss');

const TOKEN = "Don'tMessWithMMS"; // Constant token

function generateChecksum(token, payload, signature) {
    // Build plaintext
    const plaintext = payload.substring(10, 20) + token + signature.substring(2, 10);

    // Convert to UTF-16 LE
    const data = Buffer.from(plaintext, 'utf16le');

    // Hash using SHA1
    const hash = crypto.createHash('sha1').update(data).digest();

    // Select 8 specific bytes and hex encode
    const checksum = hash.slice(2, 10).toString('hex').toUpperCase();

    return checksum;
}

exports.checksumPost = (req, res) => {
    let { payload, signature } = req.body;

    // Validate input
    if (typeof payload !== 'string' || typeof signature !== 'string') {
        return res.status(400).send('Invalid input. Payload and signature must be strings.');
    }

    // Validate length of payload and signature
    if (payload.length < 20 || signature.length < 10) {
        return res.status(400).send('Invalid input. Payload must be at least 20 characters long and signature must be at least 10 characters long.');
    }

    // Sanitize the input
    payload = xss(payload);
    signature = xss(signature);

    // You might want to add more validation here, depending on the expected format of payload and signature

    try {
        const checksum = generateChecksum(TOKEN, payload, signature);
        res.send({ checksum });
    } catch (error) {
        // Send a generic error message
        res.status(400).send('An error occurred while generating the checksum, please check your inputs and try again.');
    }
};