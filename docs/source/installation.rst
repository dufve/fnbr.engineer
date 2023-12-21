Installation
============

This document will guide you through the process of installing and setting up fnbr.engineer for both local development and deployment on Heroku.

Installation and Setup
----------------------

To set up fnbr.engineer, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install the necessary dependencies with `npm install`.
4. Create a `.env` file in the root of the project and set the environment variables as follows:

   .. note::

      ENCRYPTION_KEY=`\x030é\b7°\x94\x0E-³x\x9DûËfîâÀ\x0EZâ©\x04\x9CSÑä`\x88\x9CÁ'`

5. Start the server with `npm start`.
6. Open your web browser and navigate to `http://localhost:3000` to view the website.
7. Access the API endpoints at `http://localhost:3000/api/`.

If you are deploying on Heroku, you can use Heroku's config vars instead of using a .env file. Set your config var accordingly as in the step above.

   .. warning::

      Please note that you need to have Node.js and npm installed on your machine to run this project.