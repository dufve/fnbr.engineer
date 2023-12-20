const xss = require('xss');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

class EncoderDecoder {
    /**
     * Encodes a JSON string using XOR encryption.
     * 
     * @param {string} input - The JSON string to encode.
     * @returns {string} - The encoded string.
     * @throws {Error} - If the input is not a valid JSON string or exceeds 50000 characters.
     */
    encode(input) {
        // Check if input is a string
        if (typeof input !== 'string') {
            throw new Error('Input to encode must be a string');
        }

        // Sanitize the input
        input = xss(input);

        let parsedInput;
        try {
            parsedInput = JSON.parse(input);
        } catch (error) {
            throw new Error('Input to encode must be a valid JSON string');
        }

        // Check if the parsed input is an object (and not an array)
        if (typeof parsedInput !== 'object' || Array.isArray(parsedInput)) {
            throw new Error('Input to encode must be a JSON object');
        }

        if (input.length > 50000) {
            throw new Error('Input to encode must be less than or equal to 50000 characters');
        }
    
        let stringifiedJson = unescape(encodeURIComponent(input));
        let xal = Array.from(stringifiedJson).map((char, i) => {
            let encodedCharcode = char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
            return '0'.concat((255 & encodedCharcode).toString(16)).slice(-2);
        }).join('');
        return xal;
    }

    /**
     * Decodes a string using a custom encryption algorithm.
     * 
     * @param {string} input - The string to be decoded.
     * @returns {object} - The decoded object.
     * @throws {Error} - If the input is not a string, contains non-alphanumeric characters,
     *                   has an odd number of characters, or exceeds the maximum length of 50000 characters.
     */
    decode(input) {
        // Check if input is a string
        if (typeof input !== 'string') {
            throw new Error('Input to decode must be a string');
        }

        // Check if the input is a hexadecimal string
        if (!/^[a-fA-F0-9]+$/.test(input)) {
            throw new Error('Input to decode must be a hexadecimal string');
        }

        if (input.length % 2 !== 0 || input.length > 50000) {
            throw new Error('Input to decode must have an even number of characters and be less than or equal to 50000 characters');
        }
    
        let stringifiedJson = Array.from(input.match(/.{1,2}/g)).map((hexByte, i) => {
            let encodedCharcode = parseInt(hexByte, 16);
            let originalCharcode = encodedCharcode ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
            return String.fromCharCode(originalCharcode);
        }).join('');
    
        let decodedXal;
        try {
            decodedXal = JSON.parse(decodeURIComponent(escape(stringifiedJson)));
        } catch (error) {
            throw error;
        }
        return decodedXal;
    }
}

const encoderDecoder = new EncoderDecoder();

exports.xalPost = (req, res) => {
    const { method, input } = req.body;

    try {
        let result;
        if (method === 'encode') {
            result = encoderDecoder.encode(input);
        } else if (method === 'decode') {
            result = encoderDecoder.decode(input);
        } else {
            throw new Error('Invalid method. Use "encode" or "decode".');
        }
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};