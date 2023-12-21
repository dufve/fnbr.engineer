API Endpoints
=============

This section describes the API endpoints provided by fnbr.engineer.

/api/xal
--------

**URL**: `/api/xal`

**Method**: `POST`

**Description**: This endpoint is used to encode or decode a JSON string using XOR encryption.

**Body**:

- `method`: The method to use. This can be "encode" or "decode".
- `input`: The string to encode or decode.

**Example Request**:

.. code-block:: json

   {
       "method": "encode",
       "input": "JSON string to encode"
   }

**Success Response**:

- **Code**: 200
- **Content**: `{ "result": "encoded or decoded string" }`

**Error Response**:

- **Code**: 400
- **Content**: `{ "error": "error message" }`

.. note::

   - The `input` for the "encode" method must be a valid JSON string of an object (not an array) and must be less than or equal to 50000 characters.
   - The `input` for the "decode" method must be a hexadecimal string with an even number of characters and must be less than or equal to 50000 characters.

----

/api/checksum
-------------

**URL**: `/api/checksum`

**Method**: `POST`

**Description**: This endpoint is used to generate a checksum from a payload and a signature.

**Body**:

- `payload`: The payload string. Must be at least 20 characters long.
- `signature`: The signature string. Must be at least 10 characters long.

**Example Request**:

.. code-block:: json

   {
       "payload": "yourPayloadString",
       "signature": "yourSignatureString"
   }

**Success Response**:

- **Code**: 200
- **Content**: `{ "checksum": "generated checksum" }`

**Error Response**:

- **Code**: 400
- **Content**: `{ "error": "error message" }`

.. note::

   - The `payload` must be a string and at least 20 characters long.
   - The `signature` must be a string and at least 10 characters long.